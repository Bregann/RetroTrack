using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.OldCode.Helpers;
using RetroTrack.Domain.OldCode.Models;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Enums;
using RetroTrack.Infrastructure.Database.Models;
using Serilog;
using System.Diagnostics;
using System.Net;

namespace RetroTrack.Domain.OldCode.Data.RetroAchievements
{
    public class RetroAchievements
    {
        public static async Task GetConsolesAndInsertToDatabase()
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);
            var request = new RestRequest($"API_GetConsoleIDs.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting console data. Status code {response.StatusCode}");
                return;
            }

            var responseDeserialized = JsonConvert.DeserializeObject<List<ConsoleIDs>>(response.Content);

            //Add all the new consoles into the database
            using (var context = new DatabaseContext())
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
                        GameCount = 0,
                        NoAchievementsGameCount = 0,
                        ConsoleType = ConsoleType.NotSet,
                        DisplayOnSite = false
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
                    var request = new RestRequest($"API_GetGameList.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&i={id}", Method.Get);
                    var response = await client.ExecuteAsync(request);

                    if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
                    {
                        Log.Warning($"[RetroAchievements] Error getting games for console ID {id}");
                        continue;
                    }

                    // check if the data is already in the database, if it is then skip it
                    if (context.RetroAchievementsApiData.Any(x => x.JsonData == response.Content && x.ApiRequestType == ApiRequestType.GetGameList && x.ProcessingStatus != ProcessingStatus.Errored))
                    {
                        Log.Information($"[RetroAchievements] Data is already been processed for console id {id} get game list");
                        continue;
                    }

                    //Add into the table to be picked up and processed later
                    context.RetroAchievementsApiData.Add(new RetroAchievementsApiData
                    {
                        JsonData = response.Content,
                        ProcessingStatus = ProcessingStatus.NotScheduled,
                        FailedProcessingAttempts = 0,
                        ApiRequestType = ApiRequestType.GetGameList,
                        LastUpdate = DateTime.UtcNow
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

                    // check if the data is already in the database, if it is then skip it
                    if (context.RetroAchievementsApiData.Any(x => x.JsonData == response.Content && x.ApiRequestType == ApiRequestType.GetGameExtended && x.ProcessingStatus != ProcessingStatus.Errored))
                    {
                        Log.Information($"[RetroAchievements] Data is already been processed for game id {gameId} get game extended");
                        continue;
                    }

                    //Add into the table to be picked up and processed later
                    context.RetroAchievementsApiData.Add(new RetroAchievementsApiData
                    {
                        JsonData = response.Content,
                        ProcessingStatus = ProcessingStatus.NotScheduled,
                        FailedProcessingAttempts = 0,
                        ApiRequestType = ApiRequestType.GetGameExtended,
                        LastUpdate = DateTime.UtcNow
                    });

                    Log.Information($"[RetroAchievements] Game data processed for ID {gameId}");

                    context.SaveChanges();
                    await Task.Delay(500);
                }
            }
        }

        //ONLY TO BE USED LOCALLY FOR MANUALLY UPDATING THE ENTIRE DATABASE
        //Mainly for player counts
        public static async Task ProcessEntireGamesDatabase()
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);

            using (var context = new DatabaseContext())
            {
                //Get all the new unprocessed games
                var unprocessedGames = context.Games.Select(x => x.Id).ToList();
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
                        ApiRequestType = ApiRequestType.GetGameExtended,
                        LastUpdate = DateTime.UtcNow
                    });

                    Log.Information($"[RetroAchievements] Game data processed for ID {gameId}");

                    context.SaveChanges();
                    await Task.Delay(300);
                }
            }
        }

        public static async Task GetRecentlyModifiedGamesGameData()
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);

            using (var context = new DatabaseContext())
            {
                //Get all the new unprocessed games
                //-4 days incase of any API outages
                var unprocessedGames = context.Games.Where(x => x.LastModified.Date >= DateTime.UtcNow.AddDays(-4)).Select(x => x.Id).ToList();
                Log.Information($"[RetroAchievements] {unprocessedGames.Count} games to update the data from");

                foreach (var gameId in unprocessedGames)
                {
                    var request = new RestRequest($"API_GetGameExtended.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&i={gameId}", Method.Get);
                    var response = await client.ExecuteAsync(request);

                    if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
                    {
                        Log.Warning($"[RetroAchievements] Error getting extended game info for game ID {gameId}. Status code: {response.StatusCode}");
                        continue;
                    }

                    // check if the data is already in the database, if it is then skip it
                    if (context.RetroAchievementsApiData.Any(x => x.JsonData == response.Content && x.ApiRequestType == ApiRequestType.GetGameExtended && x.ProcessingStatus != ProcessingStatus.Errored))
                    {
                        Log.Information($"[RetroAchievements] Data is already been processed for game id {gameId} get game extended");
                        continue;
                    }

                    //Add into the table to be picked up and processed later
                    context.RetroAchievementsApiData.Add(new RetroAchievementsApiData
                    {
                        JsonData = response.Content,
                        ProcessingStatus = ProcessingStatus.NotScheduled,
                        FailedProcessingAttempts = 0,
                        ApiRequestType = ApiRequestType.GetGameExtended,
                        LastUpdate = DateTime.UtcNow
                    });

                    Log.Information($"[RetroAchievements] Game data processed for ID {gameId}");

                    context.SaveChanges();
                    await Task.Delay(500);
                }
            }
        }

        public static async Task<GetUserSummary?> GetUserProfile(string username)
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);

            var request = new RestRequest($"API_GetUserSummary.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&u={username}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting user profile for {username}. Status code: {response.StatusCode}");
                return null;
            }

            return JsonConvert.DeserializeObject<GetUserSummary>(response.Content);
        }

 

        public static async Task<GetGameInfoAndUserProgress?> GetSpecificGameInfoAndUserProgress(int gameId, string username)
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);

            //Get the response and deserialise
            var request = new RestRequest($"API_GetGameInfoAndUserProgress.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&g={gameId}&u={username}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting game data for {gameId}");
                return null;
            }

            //if there's no achievements
            if (response.Content.Contains("Achievements\":[]"))
            {
                return null;
            }

            //Deseralise the data
            var data = JsonConvert.DeserializeObject<GetGameInfoAndUserProgress>(response.Content);

            //Update the player count as the values on the table are out of sync
            using (var context = new DatabaseContext())
            {
                var game = context.Games.Where(x => x.Id == data.Id).First();
                game.Players = data.Players;

                context.SaveChanges();
            }

            return data;
        }

        public static async Task GetUserGames(string username, int updateId)
        {
            var stopwatch = new Stopwatch();

            stopwatch.Start();

            try
            {
                var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);
                var request = new RestRequest($"API_GetUserCompletionProgress.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&u={username}&c=500", Method.Get);

                //Get the response and Deserialize
                var response = await client.ExecuteAsync(request);

                if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
                {
                    Log.Warning($"[RetroAchievements] Error getting user game progress data. Status code: {response.StatusCode}");
                    return;
                }

                var responseDeserialized = JsonConvert.DeserializeObject<GetUserCompletionProgress>(response.Content);

                if (responseDeserialized.Total == 0)
                {
                    Log.Information($"[RetroAchievements] No user game progress found for {username}");
                    return;
                }

                var gameList = responseDeserialized.Results;

                //Check if the total is higher than the amount gotten
                if (responseDeserialized.Total > 500)
                {
                    var timesToProcess = Math.Ceiling((decimal)responseDeserialized.Total / 500) - 1;
                    var skip = 500;

                    for (int i = 0; i < timesToProcess; i++)
                    {
                        var extraDataReq = new RestRequest($"API_GetUserCompletionProgress.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}&u={username}&c=500&o={skip}", Method.Get);

                        //Get the response and Deserialize
                        var extraDataRes = await client.ExecuteAsync(extraDataReq);

                        if (extraDataRes.Content == "" || extraDataRes.Content == null || extraDataRes.StatusCode != HttpStatusCode.OK)
                        {
                            Log.Warning($"[RetroAchievements] Error getting user game progress data. Status code: {response.StatusCode}");
                            return;
                        }

                        var extraResponseDeserialized = JsonConvert.DeserializeObject<GetUserCompletionProgress>(extraDataRes.Content);

                        gameList.AddRange(extraResponseDeserialized.Results);
                        skip += 500;
                    }
                }

                using (var context = new DatabaseContext())
                {
                    var user = context.Users.Where(x => x.Username == username).First();
                    var userProfile = await GetUserProfile(username);

                    if (userProfile != null)
                    {
                        user.UserProfileUrl = "/UserPic/" + userProfile.User + ".png";
                        user.UserRank = userProfile.Rank ?? 0;
                        user.UserPoints = userProfile.TotalPoints;
                    }

                    foreach (var game in gameList)
                    {
                        var gameData = await context.UserGameProgress.FirstOrDefaultAsync(x => x.GameId == game.GameId);

                        if (gameData != null)
                        {
                            gameData.AchievementsGained = game.NumAwarded;
                            gameData.AchievementsGainedHardcore = game.NumAwardedHardcore;
                            gameData.GamePercentage = (double)game.NumAwarded / game.MaxPossible * 100;
                            gameData.GamePercentageHardcore = (double)game.NumAwardedHardcore / game.MaxPossible * 100;
                            gameData.HighestAwardKind = RAHelper.ConvertHighestAwardKind(game.HighestAwardKind);
                            gameData.HighestAwardDate = game.HighestAwardDate.HasValue ? game.HighestAwardDate.Value.UtcDateTime : null;
                            gameData.ConsoleId = game.ConsoleId;
                            continue;
                        }
                        else
                        {
                            // Check if the game is actually in the system yet
                            if (!await context.Games.AnyAsync(x => x.Id == game.GameId))
                            {
                                Log.Information($"[User Update] Game {game.GameId} not found in database");
                                continue;
                            }

                            await context.UserGameProgress.AddAsync(new UserGameProgress
                            {
                                AchievementsGained = game.NumAwarded,
                                AchievementsGainedHardcore = game.NumAwardedHardcore,
                                GameId = game.GameId,
                                ConsoleId = game.ConsoleId,
                                GamePercentage = (double)game.NumAwarded / game.MaxPossible * 100,
                                GamePercentageHardcore = (double)game.NumAwardedHardcore / game.MaxPossible * 100,
                                Username = username,
                                HighestAwardDate = game.HighestAwardDate.HasValue ? game.HighestAwardDate.Value.UtcDateTime : null,
                                HighestAwardKind = RAHelper.ConvertHighestAwardKind(game.HighestAwardKind)
                            });
                        }
                    }

                    context.RetroAchievementsApiData.Where(x => x.Id == updateId).First().ProcessingStatus = ProcessingStatus.Processed;
                    await context.SaveChangesAsync();

                    Log.Information($"[RetroAchievements] Game progress updated for {username}");
                }

                stopwatch.Stop();
                Console.WriteLine(stopwatch.Elapsed);
            }
            catch (Exception e)
            {
                using (var context = new DatabaseContext())
                {
                    var erroredData = context.RetroAchievementsApiData.First(x => x.Id == updateId);

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

                Log.Fatal($"[RetroAchievements] Error updating user {username} - reason {e.Message}");
                return;
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
                    var gameConsoles = context.GameConsoles;

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
                    gameConsoles.Where(x => x.ConsoleID == gameList.First().ConsoleId).First().GameCount = gameList.Where(x => x.AchievementCount != 0).Count();
                    gameConsoles.Where(x => x.ConsoleID == gameList.First().ConsoleId).First().NoAchievementsGameCount = gameList.Where(x => x.AchievementCount == 0).Count();

                    foreach (var game in gameList)
                    {
                        //Check if there's achievements or not
                        if (game.AchievementCount == 0)
                        {
                            if (!context.UndevvedGames.Any(x => x.Id == game.Id) && !context.Games.Any(x => x.Id == game.Id))
                            {
                                context.UndevvedGames.Add(new UndevvedGames
                                {
                                    Id = game.Id,
                                    GameConsole = gameConsoles.First(x => x.ConsoleID == game.ConsoleId),
                                    Title = game.Title
                                });

                                Log.Information($"[RetroAchievements] Game {game.Title} added to undevved games");
                                continue;
                            }
                        }
                        else
                        {
                            //Delete it from the undevved games if needed
                            context.UndevvedGames.Where(x => x.Id == id).ExecuteDelete();

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
                                    GameConsole = gameConsoles.First(x => x.ConsoleID == game.ConsoleId),
                                    ImageIcon = game.ImageIcon,
                                    LastModified = game.DateModified!.Value.ToUniversalTime(),
                                    Points = game.Points
                                });

                                Log.Information($"[RetroAchievements] Game {game.Title} added to system");
                                continue;
                            }

                            //Check if it's been changed in the last 6 hours
                            if ((DateTime.UtcNow - game.DateModified!.Value).TotalHours <= 6)
                            {
                                //Update the game
                                var gameFromDb = context.Games.Where(x => x.Id == game.Id).First();
                                gameFromDb.LastModified = game.DateModified!.Value.ToUniversalTime();
                                gameFromDb.AchievementCount = game.AchievementCount;
                                gameFromDb.Points = game.Points;

                                Log.Information($"[RetroAchievements] Game {game.Title} updated");
                            }
                        }
                    }

                    dataToProcess.ProcessingStatus = ProcessingStatus.Processed;
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

                    //If it's processed already, remove all the current achievements for the game from the database
                    //This is incase there's been any demoted achievements or updated achievements
                    //if (gameFromDb.ExtraDataProcessed)
                    //{
                    //    //Some achievements can be moved to and from core so this can potentially mess up so we delete by achievement id
                    //    foreach (var achievement in gameData.Achievements)
                    //    {
                    //        context.Achievements.Where(x => x.Id == achievement.Value.Id).ExecuteDelete();
                    //    }
                    //}

                    foreach (var achievement in gameData.Achievements)
                    {
                        context.Achievements.Where(x => x.Id == achievement.Value.Id).ExecuteDelete();

                        context.Achievements.Add(new Achievements
                        {
                            Id = achievement.Value.Id,
                            AchievementName = achievement.Value.Title,
                            AchievementDescription = achievement.Value.Description,
                            AchievementIcon = achievement.Value.BadgeName,
                            Game = gameFromDb,
                            Points = achievement.Value.Points,
                            DisplayOrder = achievement.Value.DisplayOrder
                        });

                        context.SaveChanges();
                    }

                    Log.Information($"[RetroAchievements] Achievement data processed for game {gameFromDb.Title}");

                    gameFromDb.Title = gameData.Title;
                    gameFromDb.GameGenre = gameData.Genre;
                    gameFromDb.Players = gameData.Players;
                    gameFromDb.ExtraDataProcessed = true;
                    gameFromDb.LastModified = gameData.Updated;
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

        private static HighestAwardKind? ConvertHighestAwardKind(string? awardKind)
        {
            if (awardKind == null)
            {
                return null;
            }

            switch (awardKind)
            {
                case "beaten-softcore":
                    return HighestAwardKind.BeatenSoftcore;
                case "beaten-hardcore":
                    return HighestAwardKind.BeatenHardcore;
                case "completed":
                    return HighestAwardKind.Completed;
                case "mastered":
                    return HighestAwardKind.Mastered;
                default:
                    return null;
            }
        }
    }
}