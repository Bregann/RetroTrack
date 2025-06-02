using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Helpers;
using RetroTrack.Domain.OldCode.Models;
using Serilog;
using System.Net;

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
        public async Task<bool> ValidateApiKey(string username, string raApiKey)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetConsoleIDs.php?z={username}&y={raApiKey}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            //Make sure it hasn't errored
            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[Register User] Error valding API key for user {username}. Status code was {response.StatusCode}");
                return false;
            }

            Log.Information($"[Register User] API key matched for user {username}");
            return true;
        }

        /// <summary>
        /// Gets the specific game information from the RetroAchievements API for a given game ID. If the API call fails or returns no data, it falls back to the database data.
        /// </summary>
        /// <param name="gameId"></param>
        /// <returns></returns>
        public async Task<GetGameExtended?> GetSpecificGameInfo(int gameId)
        {
            var client = new RestClient(_baseUrl);
            var request = new RestRequest($"API_GetGameExtended.php?z={_apiUsername}&y={_apiKey}&i={gameId}", Method.Get);

            //Get the response and deserialise
            var response = await client.ExecuteAsync(request);

            // if it has failed to get the data from the api then fall back to the database data
            // there is a chance this is out of date but would get picked up on the next sync
            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
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
                    ConsoleId = gameFromDb.ConsoleID,
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

            //Update the player count as the values on the table are out of sync
            context.Games.Where(x => x.Id == gameId)
                .ExecuteUpdate(x => x.SetProperty(y => y.Players, data.Players));

            return data;
        }
    }
}
