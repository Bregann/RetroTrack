using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.RetroAchievementsApi;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Helpers;
using Serilog;
using System.Net;
using Achievement = RetroTrack.Domain.DTOs.RetroAchievementsApi.Achievement;

namespace RetroTrack.Domain.Services
{
    public class RetroAchievementsApiService(IEnvironmentalSettingHelper environmentalSettingHelper, AppDbContext context) : IRetroAchievementsApiService
    {
        private readonly string _baseUrl = "https://retroachievements.org/API/";
        private readonly string _apiUsername = environmentalSettingHelper.TryGetEnviromentalSettingValue(Enums.EnvironmentalSettingEnum.RetroAchievementsUsername)
                           ?? string.Empty;
        private readonly string _apiKey = environmentalSettingHelper.TryGetEnviromentalSettingValue(Enums.EnvironmentalSettingEnum.RetroAchievementsApiKey)
                      ?? string.Empty;

        /// <summary>
        /// Validates the API key for a given username against the RetroAchievements API.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="raApiKey"></param>
        /// <returns></returns>
        public async Task<(bool IsValidKey, string UsernameUlid)> ValidateApiKey(string username, string raApiKey)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetUserProfile.php?z={username}&y={raApiKey}&u={username}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            //Make sure it hasn't errored
            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[API Key Validation] Error valding API key for user {username}. Status code was {response.StatusCode}");
                return (false, "");
            }

            var data = JsonConvert.DeserializeObject<GetUserProfile>(response.Content);

            if (data == null)
            {
                Log.Error($"[API Key Validation] Error deserialising user profile for {username}. Response content: {response.Content}");
                return (false, "");
            }

            Log.Information($"[API Key Validation] API key matched for user {username}");
            return (true, data.Ulid);
        }

        /// <summary>
        /// Gets the specific game information from the RetroAchievements API for a given game ID. If the API call fails or returns no data, it falls back to the database data if true is passed.
        /// </summary>
        /// <param name="gameId"></param>
        /// <param name="returnDatabaseData"></param>
        /// <returns></returns>
        public async Task<GetGameExtended?> GetSpecificGameInfo(int gameId, bool returnDatabaseData = true)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetGameExtended.php?z={_apiUsername}&y={_apiKey}&i={gameId}", Method.Get);

            // Get the response and deserialise
            var response = await client.ExecuteAsync(request);

            // if it has failed to get the data from the api then fall back to the database data
            // there is a chance this is out of date but would get picked up on the next sync
            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                if (!returnDatabaseData)
                {
                    Log.Warning($"[RetroAchievements] Error getting game data for {gameId}. Status code {response.StatusCode}. Database data not returned.");
                    return null;
                }

                Log.Warning($"[RetroAchievements] Error getting game data for {gameId}. Falling back to database data");

                var gameFromDb = context.Games.FirstOrDefault(x => x.Id == gameId);

                if (gameFromDb == null)
                {
                    return null;
                }

                var achievements = context.Achievements.Where(x => x.GameId == gameId).ToDictionary(x => x.Id.ToString(), x => new Achievement
                {
                    Id = x.Id,
                    NumAwarded = 0,
                    NumAwardedHardcore = 0,
                    BadgeName = x.AchievementIcon,
                    Description = x.AchievementDescription,
                    DisplayOrder = x.DisplayOrder,
                    Points = x.Points,
                    Title = x.AchievementName
                });

                return new GetGameExtended
                {
                    AchievementCount = achievements.Count,
                    Achievements = achievements,
                    ImageBoxArt = "",
                    ImageTitle = "",
                    ImageInGame = "",
                    ConsoleId = gameFromDb.ConsoleId,
                    ConsoleName = gameFromDb.GameConsole.ConsoleName,
                    Genre = gameFromDb.GameGenre ?? "",
                    Players = gameFromDb.Players ?? 0,
                    Id = gameId,
                    Title = gameFromDb.Title,
                };
            }

            //if there's no achievements
            if (response.Content.Contains("{\"Achievements\":[],") || response.Content.Contains("Achievements\":[]"))
            {
                return null;
            }

            //Deseralise the data
            var data = JsonConvert.DeserializeObject<GetGameExtended>(response.Content);

            if (data == null)
            {
                Log.Warning($"[RetroAchievements] Error deserialising game data for {gameId}. Response content: {response.Content}");
                return null;
            }

            // Update the player count as the values on the table are out of sync
            context.Games.Where(x => x.Id == gameId)
                .ExecuteUpdate(x => x.SetProperty(y => y.Players, data.Players));

            return data;
        }

        /// <summary>
        /// Gets the list of console IDs and names from the RetroAchievements API.
        /// </summary>
        /// <returns></returns>
        public async Task<List<ConsoleIDs>?> GetConsoleIds()
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetConsoleIDs.php?z={_apiUsername}&y={_apiKey}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting console data. Status code {response.StatusCode}");
                return null;
            }

            return JsonConvert.DeserializeObject<List<ConsoleIDs>>(response.Content);
        }

        /// <summary>
        /// Gets the list of games for a specific console ID from the RetroAchievements API.
        /// </summary>
        /// <param name="consoleId"></param>
        /// <returns></returns>
        public async Task<List<GetGameList>?> GetGameListFromConsoleId(int consoleId)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetGameList.php?z={_apiUsername}&y={_apiKey}&i={consoleId}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting games for console ID {consoleId}. Status code {response.StatusCode}");
                return null;
            }

            return JsonConvert.DeserializeObject<List<GetGameList>>(response.Content);
        }

        /// <summary>
        /// Gets the user profile information for a specific username from the RetroAchievements API.
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<GetUserProfile?> GetUserProfile(string username, string ulid)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetUserProfile.php?z={_apiUsername}&y={_apiKey}&u={ulid}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting user profile for {username}. Status code {response.StatusCode}");
                return null;
            }

            return JsonConvert.DeserializeObject<GetUserProfile>(response.Content);
        }

        /// <summary>
        /// Gets the specific game information and user progress for a given username and game ID from the RetroAchievements API.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="gameId"></param>
        /// <returns></returns>
        public async Task<GetGameInfoAndUserProgress?> GetSpecificGameInfoAndUserProgress(string username, string ulid, int gameId)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetGameInfoAndUserProgress.php?z={_apiUsername}&y={_apiKey}&g={gameId}&u={ulid}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting specifc game info and user progress for {username} and game id {gameId}. Status code {response.StatusCode}");
                return null;
            }

            var data = JsonConvert.DeserializeObject<GetGameInfoAndUserProgress>(response.Content);

            if (data != null)
            {
                // Update the player count as the values on the table are out of sync
                context.Games.Where(x => x.Id == gameId)
                    .ExecuteUpdate(x => x.SetProperty(y => y.Players, data.Players));
            }

            return data;
        }

        /// <summary>
        /// Gets the user completion progress for a specific username from the RetroAchievements API.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="skipAmount"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public async Task<GetUserCompletionProgress?> GetUserCompletionProgress(string username, string ulid, int skipAmount = 0, int count = 500)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetUserCompletionProgress.php?z={_apiUsername}&y={_apiKey}&u={ulid}&c={count}&o={skipAmount}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting user completion progress for {username}. Status code {response.StatusCode}");
                return null;
            }

            return JsonConvert.DeserializeObject<GetUserCompletionProgress>(response.Content);
        }

        /// <summary>
        /// Gets the user's profile from their username from the RetroAchievements API. Returns null if the user is not found or if there is an error.
        /// This should only be used for fetching a user profile from the RetroAchievements API when the user is not found in the database.
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<GetUserProfile?> GetUserProfileFromUsername(string username)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetUserProfile.php?z=${_apiUsername}&y={_apiKey}&u={username}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting user profile for {username}. Status code {response.StatusCode}");
                return null;
            }

            return JsonConvert.DeserializeObject<GetUserProfile>(response.Content);
        }
    }
}