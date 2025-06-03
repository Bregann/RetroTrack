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

        public async Task ProcessGetGameListJob(int requestId)
        {
            var request = await context.RetroAchievementsLogAndLoadData.FirstAsync(x => x.Id == requestId);
            request.ProcessingStatus = ProcessingStatus.BeingProcessed;
            await context.SaveChangesAsync();

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
                    }
                }
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
    }
}
