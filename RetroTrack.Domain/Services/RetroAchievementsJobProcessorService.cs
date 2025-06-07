using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.RetroAchievementsApi;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces;
using Serilog;

namespace RetroTrack.Domain.Services
{
    public class RetroAchievementsJobProcessorService(AppDbContext context, IRetroAchievementsApiService raApiService) : IRetroAchievementsJobProcessorService
    {
        // This service is responsible for processing the jobs that have been queued by the RetroAchievementsJobDispatcherService
        // It will take the jobs from the queue and process them accordingly

        /// <summary>
        /// This method processes the GetGameList job. It retrieves the game list from the JSON data stored in the request, and updates or adds the games to the database.
        /// </summary>
        /// <param name="requestId"></param>
        /// <returns></returns>
        public async Task ProcessGetGameListJob(int requestId)
        {
            var request = await context.RetroAchievementsLogAndLoadData.FirstAsync(x => x.Id == requestId);
            request.ProcessingStatus = ProcessingStatus.BeingProcessed;
            request.LastUpdate = DateTime.UtcNow;
            await context.SaveChangesAsync();

            Log.Information($"[RetroAchievements] Processing GetGameList job for request {requestId}");

            try
            {
                // Deserialize the JSON data into a list of GetGameList objects
                var gameList = JsonConvert.DeserializeObject<List<GetGameList>>(request.JsonData);

                if (gameList == null)
                {
                    await HandleAndLogErroredJob(request, $"Request {requestId} has invalid JSON data for GetGameList job.");
                    return;
                }

                // update the console game count
                var consoleId = gameList.First().ConsoleId;
                var console = await context.GameConsoles.FirstAsync(x => x.ConsoleId == consoleId);

                console.GameCount = gameList.Count;
                console.NoAchievementsGameCount = gameList.Count(x => x.AchievementCount == 0);
                await context.SaveChangesAsync();

                // loop through the game list and update or add the games
                foreach (var game in gameList)
                {
                    var existingGame = await context.Games.FirstOrDefaultAsync(x => x.Id == game.Id);

                    if (existingGame != null)
                    {
                        // check the last modified date, if in the last 6 hours and achievement count is different, set ExtraDataProcessed to false
                        if (existingGame.LastModified > DateTime.UtcNow.AddHours(-6) && existingGame.AchievementCount != game.AchievementCount)
                        {
                            // check the achievement count, if the new game has achievements and the existing game does not, set ExtraDataProcessed to false & update the set released date
                            if (game.AchievementCount > 0 && existingGame.AchievementCount == 0)
                            {
                                existingGame.SetReleasedDate = DateTime.UtcNow;
                                Log.Information($"[RetroAchievements] Game {existingGame.Id} ({existingGame.Title}) has been updated with new achievements, setting SetReleasedDate to now.");
                            }

                            existingGame.LastAchievementCountChangeDate = DateTime.UtcNow;
                            existingGame.ExtraDataProcessed = false;
                            Log.Information($"[RetroAchievements] Game {existingGame.Id} ({existingGame.Title}) has been updated with new achievements, setting ExtraDataProcessed to false.");
                        }

                        // Update existing game
                        existingGame.Title = game.Title;
                        existingGame.ConsoleId = game.ConsoleId;
                        existingGame.ImageIcon = game.ImageIcon;
                        existingGame.AchievementCount = game.AchievementCount;
                        existingGame.Points = game.Points;
                        existingGame.LastModified = DateTime.SpecifyKind(game.DateModified ?? DateTime.UtcNow, DateTimeKind.Utc);
                        existingGame.HasAchievements = game.AchievementCount > 0;

                        await context.SaveChangesAsync();
                        Log.Information($"[RetroAchievements] Updated existing game: {existingGame.Id} - {existingGame.Title}");
                    }
                    else
                    {
                        var hasAchievements = game.AchievementCount > 0;

                        // add in the new game
                        var newGame = new Game
                        {
                            Id = game.Id,
                            Title = game.Title,
                            ConsoleId = game.ConsoleId,
                            ImageIcon = game.ImageIcon,
                            AchievementCount = game.AchievementCount,
                            Points = game.Points,
                            LastModified = DateTime.SpecifyKind(game.DateModified ?? DateTime.UtcNow, DateTimeKind.Utc),
                            SetReleasedDate = hasAchievements ? DateTime.UtcNow : new DateTime(0, DateTimeKind.Utc),
                            LastAchievementCountChangeDate = hasAchievements ? DateTime.UtcNow : new DateTime(0, DateTimeKind.Utc),
                            GameGenre = null,
                            Players = null,
                            HasAchievements = hasAchievements,
                            LastExtraDataProcessedDate = null,
                            ExtraDataProcessed = !hasAchievements, // New games need extra data processing only if they have achievements
                            DiscordMessageProcessed = false,
                            EmailMessageProcessed = false
                        };

                        await context.Games.AddAsync(newGame);
                        Log.Information($"[RetroAchievements] Added new game: {newGame.Id} - {newGame.Title}");
                        await context.SaveChangesAsync();
                    }
                }

                // Update the request status to processed
                request.ProcessingStatus = ProcessingStatus.Processed;
                request.LastUpdate = DateTime.UtcNow;
                await context.SaveChangesAsync();

                Log.Information($"[RetroAchievements] Successfully processed GetGameList job for request {requestId}");
            }
            catch (Exception ex)
            {
                await HandleAndLogException(ex, request.Id, "GetGameList");
            }
        }

        /// <summary>
        /// This method processes the GetExtendedGameData job. It retrieves the extended game data from the JSON data stored in the request, updates the game information, and processes the achievements.
        /// </summary>
        /// <param name="requestId"></param>
        /// <returns></returns>
        public async Task ProcessGetExtendedGameDataJob(int requestId)
        {
            var request = await context.RetroAchievementsLogAndLoadData.FirstAsync(x => x.Id == requestId);
            request.ProcessingStatus = ProcessingStatus.BeingProcessed;
            request.LastUpdate = DateTime.UtcNow;
            await context.SaveChangesAsync();

            Log.Information($"[RetroAchievements] Processing GetExtendedGameData job for request {requestId}");

            try
            {
                // get the game data from the request
                var gameData = JsonConvert.DeserializeObject<GetGameExtended>(request.JsonData);

                if (gameData == null)
                {
                    await HandleAndLogErroredJob(request, $"Request {requestId} has invalid JSON data for GetExtendedGameData job.");
                    return;
                }

                // get the game and update the data
                var game = await context.Games.FirstAsync(x => x.Id == gameData.Id);
                game.GameGenre = gameData.Genre;
                game.Players = gameData.Players;
                game.LastExtraDataProcessedDate = DateTime.UtcNow;
                game.ConsoleId = gameData.ConsoleId;

                await context.SaveChangesAsync();

                if (gameData.Achievements == null || !gameData.Achievements.Any())
                {
                    game.HasAchievements = false;
                    game.ExtraDataProcessed = true;

                    request.ProcessingStatus = ProcessingStatus.Processed;
                    request.LastUpdate = DateTime.UtcNow;

                    await context.SaveChangesAsync();
                    Log.Information($"[RetroAchievements] Game {game.Id} ({game.Title}) has no achievements, setting ExtraDataProcessed to true.");
                    return;
                }

                // get the achievements for the game, if there are any in the database that aren't in the game data, remove them
                var existingAchievements = await context.Achievements
                    .Where(x => x.GameId == game.Id)
                    .ToListAsync();

                var achievementsRemoved = 0;

                foreach (var achievement in existingAchievements)
                {
                    if (!gameData.Achievements.ContainsKey(achievement.Id.ToString()))
                    {
                        context.Achievements.Remove(achievement);
                        achievementsRemoved++;
                        Log.Information($"[RetroAchievements] Removed achievement {achievement.Id} ({achievement.AchievementName}) from game {game.Id} ({game.Title}) as it is no longer present in the game data.");
                    }
                }

                await context.SaveChangesAsync();
                Log.Information($"[RetroAchievements] Removed {achievementsRemoved} achievements from game {game.Id} ({game.Title}) that are no longer present in the game data.");

                // process the achievements
                foreach (var achievement in gameData.Achievements)
                {
                    // check if the achievement already exists in the database
                    var existingAchievement = await context.Achievements.FirstOrDefaultAsync(x => x.Id == achievement.Value.Id && x.GameId == game.Id);

                    if (existingAchievement != null)
                    {
                        existingAchievement.AchievementName = achievement.Value.Title;
                        existingAchievement.AchievementDescription = achievement.Value.Description;
                        existingAchievement.AchievementIcon = achievement.Value.BadgeName;
                        existingAchievement.Points = achievement.Value.Points;
                        existingAchievement.DisplayOrder = achievement.Value.DisplayOrder;
                        existingAchievement.AchievementType = achievement.Value.Type;
                        existingAchievement.NumAwarded = achievement.Value.NumAwarded;
                        existingAchievement.NumAwardedHardcore = achievement.Value.NumAwardedHardcore;
                    }
                    else
                    {
                        var newAchievement = new Database.Models.Achievement
                        {
                            Id = achievement.Value.Id,
                            AchievementName = achievement.Value.Title,
                            AchievementDescription = achievement.Value.Description,
                            AchievementIcon = achievement.Value.BadgeName,
                            Points = achievement.Value.Points,
                            DisplayOrder = achievement.Value.DisplayOrder,
                            AchievementType = achievement.Value.Type,
                            NumAwarded = achievement.Value.NumAwarded,
                            NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                            GameId = game.Id
                        };

                        await context.Achievements.AddAsync(newAchievement);
                    }
                }

                await context.SaveChangesAsync();
                Log.Information($"[RetroAchievements] Successfully processed GetExtendedGameData job for game {game.Id} ({game.Title}) with {gameData.Achievements.Count} achievements.");

                // Update the game to indicate that extra data has been processed
                game.ExtraDataProcessed = true;
                request.ProcessingStatus = ProcessingStatus.Processed;
                request.LastUpdate = DateTime.UtcNow;
                await context.SaveChangesAsync();

                Log.Information($"[RetroAchievements] Game {game.Id} ({game.Title}) has been updated with extra data, setting ExtraDataProcessed to true.");

                // update the request status to processed
                request.ProcessingStatus = ProcessingStatus.Processed;
                request.LastUpdate = DateTime.UtcNow;
                await context.SaveChangesAsync();

                Log.Information($"[RetroAchievements] Successfully processed GetExtendedGameData job for request {requestId}");
            }
            catch (Exception ex)
            {
                await HandleAndLogException(ex, request.Id, "GetExtendedGameData");
            }
        }

        /// <summary>
        /// This method processes the UserUpdate job. It retrieves the user data from the RetroAchievements API, updates the user profile, and processes the user's game progress.
        /// </summary>
        /// <param name="requestId"></param>
        /// <returns></returns>
        public async Task ProcessUserUpdateJob(int requestId)
        {
            var request = await context.RetroAchievementsLogAndLoadData.FirstAsync(x => x.Id == requestId);
            request.ProcessingStatus = ProcessingStatus.BeingProcessed;
            request.LastUpdate = DateTime.UtcNow;
            await context.SaveChangesAsync();

            Log.Information($"[RetroAchievements] Processing UserUpdate job for request {requestId}");

            // get the user from the request, the json data should contain the user ID
            var user = await context.Users.FirstAsync(x => x.Id == int.Parse(request.JsonData));

            try
            {
                // get the user data from the RetroAchievements API
                var userData = await raApiService.GetUserCompletionProgress(user.LoginUsername, user.RAUserUlid);

                if (userData == null)
                {
                    await HandleAndLogErroredJob(request, $"User {user} not found or no data returned from API.");
                    return;
                }

                var gameList = userData.Results;

                if (userData.Total > 500)
                {
                    Log.Information($"[RetroAchievements] User {user} has more than 500 games, processing additional data in batches.");
                    var timesToProcess = Math.Ceiling((decimal)userData.Total / 500) - 1;
                    var skip = 500;

                    for (int i = 0; i < timesToProcess; i++)
                    {
                        var extraData = await raApiService.GetUserCompletionProgress(user.LoginUsername, user.RAUserUlid, skip);

                        if (extraData == null || extraData.Results == null)
                        {
                            await HandleAndLogErroredJob(request, $"Failed to retrieve additional game data for user {user}.");
                            return;
                        }

                        gameList.AddRange(extraData.Results);
                        skip += 500;
                    }
                }

                Log.Information($"[RetroAchievements] User {user} has {gameList.Count} games to process.");

                // grab the user profile from the api
                var userProfile = await raApiService.GetUserProfile(user.LoginUsername, user.RAUserUlid);

                if (userProfile == null)
                {
                    await HandleAndLogErroredJob(request, $"User {user} profile not found or no data returned from API.");
                    return;
                }

                // get the user from the database
                user.UserProfileUrl = "/UserPic/" + userProfile.User + ".png";
                user.UserPoints = userProfile.TotalPoints;
                user.LastUserUpdate = DateTime.UtcNow;

                await context.SaveChangesAsync();

                Log.Information($"[RetroAchievements] User {user} profile updated with points: {user.UserPoints}, profile URL: {user.UserProfileUrl}");

                // process the game list
                // firstly check if there are any games in the database that are not in the game list, if so, remove them
                // they could have reset their progress

                var existingGames = await context.UserGameProgress
                    .Where(x => x.UserId == user.Id)
                    .ToListAsync();

                var gamesRemoved = 0;
                foreach (var existingGame in existingGames)
                {
                    if (!gameList.Any(x => x.GameId == existingGame.GameId))
                    {
                        context.UserGameProgress.Remove(existingGame);
                        gamesRemoved++;
                        Log.Information($"[RetroAchievements] Removed game {existingGame.GameId} ({existingGame.Game}) from user {user} as it is no longer present in the game list.");
                    }
                }

                await context.SaveChangesAsync();

                Log.Information($"[RetroAchievements] Removed {gamesRemoved} games from user {user} that are no longer present in the game list.");

                // now loop through the game list and update or add the games
                foreach (var game in gameList)
                {
                    // check if the game already exists for the user
                    var existingGame = await context.UserGameProgress.FirstOrDefaultAsync(x => x.GameId == game.GameId && x.UserId == user.Id);

                    if (existingGame != null)
                    {
                        // Update existing game progress
                        existingGame.AchievementsGained = game.NumAwarded;
                        existingGame.AchievementsGainedHardcore = game.NumAwardedHardcore;
                        existingGame.GamePercentage = (double)game.NumAwarded / game.MaxPossible * 100;
                        existingGame.GamePercentageHardcore = (double)game.NumAwardedHardcore / game.MaxPossible * 100;
                        existingGame.HighestAwardKind = ConvertHighestAwardKind(game.HighestAwardKind);
                        existingGame.HighestAwardDate = game.HighestAwardDate.HasValue ? game.HighestAwardDate.Value.UtcDateTime : null;
                        existingGame.ConsoleId = game.ConsoleId;

                        Log.Information($"[RetroAchievements] Updated existing game progress for {user} on game {game.GameId} ({game.Title})");
                    }
                    else
                    {
                        // Add new game progress
                        var newUserGameProgress = new UserGameProgress
                        {
                            UserId = user.Id,
                            GameId = game.GameId,
                            ConsoleId = game.ConsoleId,
                            AchievementsGained = game.NumAwarded,
                            AchievementsGainedHardcore = game.NumAwardedHardcore,
                            GamePercentage = (double)game.NumAwarded / game.MaxPossible * 100,
                            GamePercentageHardcore = (double)game.NumAwardedHardcore / game.MaxPossible * 100,
                            HighestAwardKind = ConvertHighestAwardKind(game.HighestAwardKind),
                            HighestAwardDate = game.HighestAwardDate.HasValue ? game.HighestAwardDate.Value.UtcDateTime : null
                        };

                        await context.UserGameProgress.AddAsync(newUserGameProgress);
                        Log.Information($"[RetroAchievements] Added new game progress for {user} on game {game.GameId} ({game.Title})");
                    }
                }

                await context.SaveChangesAsync();
                Log.Information($"[RetroAchievements] Successfully processed UserUpdate job for user {user} with {gameList.Count} games.");

                // Update the request status to processed
                request.ProcessingStatus = ProcessingStatus.Processed;
                request.LastUpdate = DateTime.UtcNow;
                await context.SaveChangesAsync();

                Log.Information($"[RetroAchievements] Successfully processed UserUpdate job for request {requestId}");
            }
            catch (Exception ex)
            {
                await HandleAndLogException(ex, request.Id, "UserUpdate");
            }
        }

        /// <summary>
        /// Handles exceptions that occur during job processing, logs the error, updates the request status, and records the error in the database.
        /// </summary>
        /// <param name="ex"></param>
        /// <param name="request"></param>
        /// <param name="jobName"></param>
        /// <returns></returns>
        private async Task HandleAndLogException(Exception ex, int requestId, string jobName)
        {
            try
            {
                Log.Error(ex, $"[RetroAchievements] Error processing {jobName} job for request {requestId}: {ex.Message}");

                // clear context to avoid tracking issues
                context.ChangeTracker.Clear();

                var request = await context.RetroAchievementsLogAndLoadData.FirstAsync(x => x.Id == requestId);

                request.ProcessingStatus = ProcessingStatus.Errored;
                request.LastUpdate = DateTime.UtcNow;
                request.FailedProcessingAttempts++;

                await context.RetroAchievementsLogAndLoadErrors.AddAsync(new RetroAchievementsLogAndLoadError
                {
                    LogAndLoadDataId = request.Id,
                    ErrorMessage = $"Error processing {jobName} job: {ex.Message}. {ex.InnerException}",
                    ErrorTimestamp = DateTime.UtcNow
                });

                await context.SaveChangesAsync();
            }
            catch (Exception handleEx)
            {
                Log.Error(handleEx, $"[RetroAchievements] Error handling exception for {jobName} job for request {requestId}: {handleEx.Message}");
            }
        }

        /// <summary>
        /// Handles and logs an errored job, updates the request status, and records the error in the database.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        private async Task HandleAndLogErroredJob(RetroAchievementsLogAndLoadData request, string errorMessage)
        {
            Log.Error($"[RetroAchievements] Error processing job {request.Id}: {errorMessage}");

            request.ProcessingStatus = ProcessingStatus.Errored;
            request.LastUpdate = DateTime.UtcNow;
            request.FailedProcessingAttempts++;

            await context.RetroAchievementsLogAndLoadErrors.AddAsync(new RetroAchievementsLogAndLoadError
            {
                LogAndLoadDataId = request.Id,
                ErrorMessage = errorMessage,
                ErrorTimestamp = DateTime.UtcNow
            });
            await context.SaveChangesAsync();
        }

        /// <summary>
        /// Converts the string representation of the highest award kind to the corresponding enum value.
        /// </summary>
        /// <param name="awardKind"></param>
        /// <returns></returns>
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
