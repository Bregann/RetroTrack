using Microsoft.EntityFrameworkCore.Metadata;
using Newtonsoft.Json;
using RestSharp;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Models;
using RetroTrack.Infrastructure.Database.Enums;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using RetroTrack.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace RetroTrack.Domain.Data.External
{
    public class RetroAchievements
    {
        public static async Task<bool> ValidateApiKey(string username, string raApiKey)
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);
            var request = new RestRequest($"API_GetConsoleIDs.php?z={username}&y={raApiKey}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            //Make sure it hasn't errored
            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[Register User] Error valding API key for user {username}. Status code was {response.StatusCode}");
                return false;
            }

            return true;
        }

        public static async Task GetConsolesAndInsertToDatabase()
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);
            var request = new RestRequest($"API_GetConsoleIDs.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting console data. Status code {response.StatusCode}");
                return;
            }

            var responseDeserialized = JsonConvert.DeserializeObject<List<ConsoleIDs>>(response.Content);

            //Add all the new consoles into the database
            using(var context = new DatabaseContext())
            {
                foreach (var console in responseDeserialized)
                {
                    //hubs and events are skipped
                    if (console.Id == 100 || console.Id == 101)
                    {
                        continue;
                    }

                    //Don't add it if it already exists
                    if (context.GameConsoles.Any(x => x.ConsoleID == console.Id))
                    {
                        Log.Information($"[RetroAchievements] Console ID {console.Id} already exists in DB");
                        continue;
                    }

                    await context.GameConsoles.AddAsync(new GameConsoles
                    {
                        ConsoleID = console.Id,
                        ConsoleName = console.Name,
                        GameCount = 0
                    });

                    Log.Information($"[RetroAchievements] Console ID {console.Id} added");
                }

                context.SaveChanges();
            }
        }

        public static async Task GetGamesFromConsoleIds()
        {
            using (var context = new DatabaseContext())
            {
                var consoleIds = context.GameConsoles.Select(x => x.ConsoleID).ToList();

                var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);

                foreach (var id in consoleIds)
                {
                    var request = new RestRequest($"API_GetGameList.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&i={id}&f=1", Method.Get);
                    var response = await client.ExecuteAsync(request);

                    if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
                    {
                        Log.Warning($"[RetroAchievements] Error getting games for console ID {id}");
                        continue;
                    }

                    //Add into the table to be picked up and processed later
                    context.RetroAchievementsApiData.Add(new RetroAchievementsApiData
                    {
                        JsonData = response.Content,
                        ProcessingStatus = ProcessingStatus.NotScheduled,
                        FailedProcessingAttempts = 0,
                        ApiRequestType = ApiRequestType.GetGameList
                    });

                    Log.Information($"[RetroAchievements] Console ID {id} processed");
                    await Task.Delay(500); //delay it a little bit so we don't hit the api too hard
                }

                context.SaveChanges();
            }
        }

        public static async Task GetUnprocessedGameData()
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);

            using (var context = new DatabaseContext()) 
            {
                //Get all the new unprocessed games
                var unprocessedGames = context.Games.Where(x => !x.ExtraDataProcessed).Select(x => x.Id).ToList();
                Log.Information($"[RetroAchievements] {unprocessedGames.Count} games to get extra data from");

                foreach (var gameId in unprocessedGames)
                {
                    var request = new RestRequest($"API_GetGameExtended.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&i={gameId}", Method.Get);
                    var response = await client.ExecuteAsync(request);

                    if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
                    {
                        Log.Warning($"[RetroAchievements] Error getting extended game info for game ID {gameId}. Status code: {response.StatusCode}");
                        continue;
                    }

                    //Add into the table to be picked up and processed later
                    context.RetroAchievementsApiData.Add(new RetroAchievementsApiData
                    {
                        JsonData = response.Content,
                        ProcessingStatus = ProcessingStatus.NotScheduled,
                        FailedProcessingAttempts = 0,
                        ApiRequestType = ApiRequestType.GetGameExtended
                    });

                    Log.Information($"[RetroAchievements] Game data processed for ID {gameId}");

                    context.SaveChanges();
                    await Task.Delay(500);
                }
            }
        }

        public static async Task GetUserGames(string username)
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);
            var request = new RestRequest($"API_GetUserCompletedGames.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&u={username}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting completed games data. Status code: {response.StatusCode}");
                return;
            }

            var responseDeserialized = JsonConvert.DeserializeObject<List<GetUserCompletedGames>>(response.Content);

            if (responseDeserialized.Count == 0)
            {
                Log.Information($"[RetroAchievements] No completed games found for {username}");
                return;
            }

            //Order the list so it only has hardcore first and no dupes
            var gameList = responseDeserialized.OrderByDescending(x => x.HardcoreMode).DistinctBy(x => x.GameId).ToList();

            using (var context = new DatabaseContext()) 
            {
                var user = context.Users.Where(x => x.Username == username).First();

                foreach (var game in gameList)
                {
                    //Check if it already exists, if so update the field
                    var userData = context.UserGameProgress.Where(x => x.Id == game.GameId && x.User.Username == username).FirstOrDefault();

                    if (userData != null)
                    {
                        userData.AchievementsGained = game.AchievementsAwarded;
                        userData.GamePercentage = userData.GamePercentage;
                        userData.HardcoreMode = userData.HardcoreMode;
                        continue;
                    }

                    //weird bug with some games - says null max achievements/percentage so prevent crashing with the deralised object as nullable
                    double pct = 0;

                    if (game.PctWon != null)
                    {
                        pct = (double)game.PctWon;
                    }

                    context.UserGameProgress.Add(new UserGameProgress
                    {
                        User = user,
                        AchievementsGained = game.AchievementsAwarded,
                        ConsoleID = game.ConsoleId, 
                        GameID = game.GameId,
                        GameName = game.Title,
                        GamePercentage = pct,
                        HardcoreMode = game.HardcoreMode
                    });

                    context.SaveChanges();

                    Log.Information($"[RetroAchievements] Game progress for ID {game.GameId} updated for {username}");
                }
            }
        }

        public static void AddOrUpdateGamesToDatabase(int id)
        {
            try
            {
                using (var context = new DatabaseContext())
                {
                    var dataToProcess = context.RetroAchievementsApiData.First(x => x.Id == id);
                    var gameList = JsonConvert.DeserializeObject<List<GetGameList>>(dataToProcess.JsonData);

                    if (gameList == null)
                    {
                        Log.Information($"[RetroAchievements] No data to process for request ID {id}");
                        dataToProcess.ProcessingStatus = ProcessingStatus.Processed;
                        context.SaveChanges();
                        return;
                    }

                    if (gameList.Count == 0)
                    {
                        Log.Information($"[RetroAchievements] No games in array for request ID {id}");
                        dataToProcess.ProcessingStatus = ProcessingStatus.Processed;
                        context.SaveChanges();
                        return;
                    }

                    //Update the game count for the console
                    context.GameConsoles.Where(x => x.ConsoleID == gameList.First().ConsoleId).First().GameCount = gameList.Count();

                    foreach (var game in gameList)
                    {
                        //Check if it exists in the database, if not then add it in
                        if (!context.Games.Any(x => x.Id == game.Id))
                        {
                            context.Games.Add(new Games
                            {
                                Title = game.Title,
                                Id = game.Id,
                                DiscordMessageProcessed = false,
                                EmailMessageProcessed = false,
                                ExtraDataProcessed = false,
                                AchievementCount = game.AchievementCount,
                                GameConsoleId = game.ConsoleId,
                                ImageIcon = game.ImageIcon,
                                LastModified = game.DateModified.ToUniversalTime(),
                                Points = game.Points
                            });

                            Log.Information($"[RetroAchievements] Game {game.Title} added to system");

                            continue;
                        }

                        //Check if it's been changed in the last 6 hours
                        if ((DateTime.UtcNow - game.DateModified).TotalHours <= 6)
                        {
                            //Update the game
                            var gameFromDb = context.Games.Where(x => x.Id == game.Id).First();
                            gameFromDb.LastModified = game.DateModified.ToUniversalTime();
                            gameFromDb.AchievementCount = game.AchievementCount;
                            gameFromDb.Points = game.Points;

                            Log.Information($"[RetroAchievements] Game {game.Title} updated");
                        }
                    }

                    dataToProcess.ProcessingStatus = ProcessingStatus.Processed;
                    context.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Log.Warning($"[RetroAchievements] Error updating RetroAchievement API data for ID {id} - Error: {e}");

                using(var context = new DatabaseContext())
                {
                    var erroredData = context.RetroAchievementsApiData.First(x => x.Id == id);

                    //Check if it's already failed 3 times, if it has then set it to errrored
                    if (erroredData.FailedProcessingAttempts == 3)
                    {
                        erroredData.ProcessingStatus = ProcessingStatus.Errored;
                        //todo: send message on error
                    }
                    else
                    {
                        erroredData.ProcessingStatus = ProcessingStatus.NotScheduled;
                        erroredData.FailedProcessingAttempts = erroredData.FailedProcessingAttempts + 1;
                    }

                    context.SaveChanges();
                }
            }
        }

        public static void AddOrUpdateExtraGameInfoToDatabase(int id)
        {
            try
            {
                using (var context = new DatabaseContext())
                {
                    var dataToProcess = context.RetroAchievementsApiData.First(x => x.Id == id);
                    var gameData = JsonConvert.DeserializeObject<GetGameExtended>(dataToProcess.JsonData);

                    //Get the game and update the values
                    var gameFromDb = context.Games.First(x => x.Id == gameData.Id);
                    gameFromDb.GameGenre = gameData.Genre;
                    gameFromDb.Players = gameData.Players;
                    gameFromDb.ExtraDataProcessed = true;
                    dataToProcess.ProcessingStatus = ProcessingStatus.Processed;

                    Log.Information($"[RetroAchievments] Game {gameFromDb.Title} extra data processed");
                    context.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Log.Warning($"[RetroAchievements] Error updating RetroAchievement API data for ID {id} - Error: {e}");

                using (var context = new DatabaseContext())
                {
                    var erroredData = context.RetroAchievementsApiData.First(x => x.Id == id);

                    //Check if it's already failed 3 times, if it has then set it to errrored
                    if (erroredData.FailedProcessingAttempts == 3)
                    {
                        erroredData.ProcessingStatus = ProcessingStatus.Errored;
                        //todo: send message on error
                    }
                    else
                    {
                        erroredData.ProcessingStatus = ProcessingStatus.NotScheduled;
                        erroredData.FailedProcessingAttempts = erroredData.FailedProcessingAttempts + 1;
                    }

                    context.SaveChanges();
                }
            }
        }

    }
}
