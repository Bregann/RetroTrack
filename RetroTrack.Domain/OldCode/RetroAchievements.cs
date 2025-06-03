using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using RetroTrack.Domain.Enums;
using Serilog;
using System.Diagnostics;
using System.Net;

namespace RetroTrack.Domain.OldCode
{
    public class RetroAchievements
    {
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
                    foreach (var game in gameList)
                    {
                        else
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