using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.RetroAchievementsApi;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Services
{
    public class RetroAchievementsJobProcessorService(AppDbContext context) : IRetroAchievementsJobProcessorService
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
            await context.SaveChangesAsync();

            Log.Information($"[RetroAchievements] Processing GetGameList job for request {requestId}");

            try
            {
                // Deserialize the JSON data into a list of GetGameList objects
                var gameList = JsonConvert.DeserializeObject<List<GetGameList>>(request.JsonData);

                if (gameList == null)
                {
                    request.ProcessingStatus = ProcessingStatus.Errored;
                    request.LastUpdate = DateTime.UtcNow;
                    request.FailedProcessingAttempts++;

                    await context.RetroAchievementsLogAndLoadErrors.AddAsync(new RetroAchievementsLogAndLoadErrors
                    {
                        LogAndLoadDataId = requestId,
                        ErrorMessage = "Invalid JSON data for GetGameList job.",
                        ErrorTimestamp = DateTime.UtcNow
                    });

                    await context.SaveChangesAsync();
                    Log.Warning($"[RetroAchievements] Request {requestId} has invalid JSON data for GetGameList job.");
                    return;
                }

                // update the console game count
                var consoleId = gameList.First().ConsoleId;
                var console = await context.GameConsoles.FirstAsync(x => x.ConsoleID == consoleId);

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

                            existingGame.ExtraDataProcessed = false;
                            Log.Information($"[RetroAchievements] Game {existingGame.Id} ({existingGame.Title}) has been updated with new achievements, setting ExtraDataProcessed to false.");
                        }

                        // Update existing game
                        existingGame.Title = game.Title;
                        existingGame.ConsoleID = game.ConsoleId;
                        existingGame.ImageIcon = game.ImageIcon;
                        existingGame.AchievementCount = game.AchievementCount;
                        existingGame.Points = game.Points;
                        existingGame.LastModified = game.DateModified ?? DateTime.UtcNow;
                        existingGame.HasAchievements = game.AchievementCount > 0;

                        await context.SaveChangesAsync();
                        Log.Information($"[RetroAchievements] Updated existing game: {existingGame.Id} - {existingGame.Title}");
                    }
                    else
                    {
                        // add in the new game
                        var newGame = new Games
                        {
                            Id = game.Id,
                            Title = game.Title,
                            ConsoleID = game.ConsoleId,
                            ImageIcon = game.ImageIcon,
                            AchievementCount = game.AchievementCount,
                            Points = game.Points,
                            LastModified = game.DateModified ?? DateTime.UtcNow,
                            SetReleasedDate = DateTime.UtcNow, // Set to now for new games
                            GameGenre = null,
                            Players = null,
                            HasAchievements = game.AchievementCount > 0,
                            LastExtraDataProcessedDate = null, // Set to now for new games
                            ExtraDataProcessed = false, // New games need extra data processing
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
                request.ProcessingStatus = ProcessingStatus.Errored;
                request.LastUpdate = DateTime.UtcNow;
                request.FailedProcessingAttempts++;

                await context.RetroAchievementsLogAndLoadErrors.AddAsync(new RetroAchievementsLogAndLoadErrors
                {
                    LogAndLoadDataId = requestId,
                    ErrorMessage = $"Error processing GetGameList job: {ex.Message}",
                    ErrorTimestamp = DateTime.UtcNow
                });

                await context.SaveChangesAsync();

                Log.Error(ex, $"[RetroAchievements] Error processing GetGameList job for request {requestId}: {ex.Message}");
            }
        }

        public async Task ProcessGetExtendedGameDataJob(int requestId)
        {
            var request = await context.RetroAchievementsLogAndLoadData.FirstAsync(x => x.Id == requestId);
            request.ProcessingStatus = ProcessingStatus.BeingProcessed;
            await context.SaveChangesAsync();

            Log.Information($"[RetroAchievements] Processing GetExtendedGameData job for request {requestId}");

            try
            {
                // get the game data from the request
                var gameData = JsonConvert.DeserializeObject<GetGameExtended>(request.JsonData);

                if (gameData == null)
                {
                    request.ProcessingStatus = ProcessingStatus.Errored;
                    request.LastUpdate = DateTime.UtcNow;
                    request.FailedProcessingAttempts++;

                    await context.RetroAchievementsLogAndLoadErrors.AddAsync(new RetroAchievementsLogAndLoadErrors
                    {
                        LogAndLoadDataId = requestId,
                        ErrorMessage = "Invalid JSON data for GetExtendedGameData job.",
                        ErrorTimestamp = DateTime.UtcNow
                    });

                    await context.SaveChangesAsync();
                    Log.Warning($"[RetroAchievements] Request {requestId} has invalid JSON data for GetExtendedGameData job.");
                    return;
                }

                // get the game and update the data
                var game = await context.Games.FirstAsync(x => x.Id == gameData.Id);
                game.GameGenre = gameData.Genre;
                game.Players = gameData.Players;
                game.LastExtraDataProcessedDate = DateTime.UtcNow;
                game.ConsoleID = gameData.ConsoleId;

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
                        var newAchievement = new Achievements
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
                Log.Error(ex, $"[RetroAchievements] Error processing GetExtendedGameData job for request {requestId}: {ex.Message}");
                request.ProcessingStatus = ProcessingStatus.Errored;
                request.LastUpdate = DateTime.UtcNow;
                request.FailedProcessingAttempts++;

                await context.RetroAchievementsLogAndLoadErrors.AddAsync(new RetroAchievementsLogAndLoadErrors
                {
                    LogAndLoadDataId = requestId,
                    ErrorMessage = $"Error processing GetExtendedGameData job: {ex.Message}",
                    ErrorTimestamp = DateTime.UtcNow
                });

                await context.SaveChangesAsync();
            }
        }
    }
}
