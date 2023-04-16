using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using RetroTrack.Domain.Models;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Enums;
using RetroTrack.Infrastructure.Database.Models;
using Serilog;
using System.Net;

namespace RetroTrack.Domain.Data.External
{
    public class ProcessingData
    {
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
                            if(!context.UndevvedGames.Any(x => x.Id == game.Id) && !context.Games.Any(x => x.Id == game.Id))
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
        public static void UpdateGameClaims(int id)
        {
            try
            {
                using(var context = new DatabaseContext()) 
                {
                    var dataToProcess = context.RetroAchievementsApiData.First(x => x.Id == id);
                    var gameData = JsonConvert.DeserializeObject<List<GetActiveClaims>>(dataToProcess.JsonData);

                    if (gameData == null)
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
                        return;
                    }

                    var gamesClaimed = context.UndevvedGames.Where(x => x.PrimaryDeveloper != null).ToList();

                    //Check games that have been claimed in the database and verify if they are still in the active claim list
                    foreach (var game in gamesClaimed)
                    {
                        //If it exists, make sure the developer is the same
                        var gameFromApi = gameData.FirstOrDefault(x => x.GameId == game.Id);

                        if (gameFromApi == null)
                        {
                            game.PrimaryDeveloper = null;
                            Log.Information($"[RetroAchievements] Claim for game {game.Id} dropped");
                            continue;
                        }
                        else
                        {
                            //Check if its primary or collab
                            if (gameFromApi.ClaimType == 0)
                            {
                                game.PrimaryDeveloper = gameFromApi.User;
                                gameData.Remove(gameFromApi);
                                Log.Information($"[RetroAchievements] Primary claim for game {game.Id} updated - user claimed: {gameFromApi.User}");
                                continue;
                            }
                            else
                            {
                                if (game.CollabDevelopers == null)
                                {
                                    game.CollabDevelopers = new List<string> { gameFromApi.User };
                                    gameData.Remove(gameFromApi);
                                    Log.Information($"[RetroAchievements] Collab claim for game {game.Id} new - user claimed: {gameFromApi.User}");
                                    continue;
                                }

                                game.CollabDevelopers.Clear();
                                game.CollabDevelopers.Add(gameFromApi.User);
                                gameData.Remove(gameFromApi);
                                Log.Information($"[RetroAchievements] Collab claim for game {game.Id} updated - user claimed: {gameFromApi.User}");
                            }
                        }
                    }

                    //Now go through the games from the api
                    foreach (var game in gameData)
                    {
                        //get game from database
                        var gameFromDb = context.UndevvedGames.FirstOrDefault(x => x.Id == game.GameId);

                        if (gameFromDb == null)
                        {
                            Log.Information($"[RetroAchievements] Could not find claimed game {game.GameId} in table");
                            continue;
                        }

                        //Check if its primary or collab
                        if (game.ClaimType == 0)
                        {
                            gameFromDb.PrimaryDeveloper = game.User;
                            Log.Information($"[RetroAchievements] Primary claim made by {game.User} on game {game.GameId}");
                            continue;
                        }
                        else
                        {
                            if (gameFromDb.CollabDevelopers == null)
                            {
                                gameFromDb.CollabDevelopers = new List<string> { game.User };
                                Log.Information($"[RetroAchievements] Collab claim for game {game.Id} new - user claimed: {game.User}");
                                continue;
                            }
                            else
                            {
                                gameFromDb.CollabDevelopers.Clear();
                                gameFromDb.CollabDevelopers.Add(game.User);
                                Log.Information($"[RetroAchievements] Collab claim for game {game.Id} updated - user claimed: {game.User}");
                            }
                        }
                    }

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