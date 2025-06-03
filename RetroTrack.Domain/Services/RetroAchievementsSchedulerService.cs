using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces;
using Serilog;

namespace RetroTrack.Domain.Services
{
    public class RetroAchievementsSchedulerService(AppDbContext context, IRetroAchievementsApiService raApiService) : IRetroAchievementsSchedulerService
    {
        // This service is responsible for scheduling and managing RetroAchievements related tasks.
        // It interacts with the RetroAchievements API to fetch consoles, games, and game data, and inserts them into the database for further processing.

        /// <summary>
        /// Gets the list of consoles from the RetroAchievements API and inserts them into the database.
        /// </summary>
        /// <returns></returns>
        public async Task GetConsolesAndInsertToDatabase()
        {
            var response = await raApiService.GetConsoleIds();

            if (response == null || response.Count == 0)
            {
                Log.Error("[RetroAchievements] No consoles found in RetroAchievements API response.");
                return;
            }

            foreach (var console in response)
            {
                //hubs and events are skipped
                if (console.Id == 100 || console.Id == 101)
                {
                    continue;
                }

                //Don't add it if it already exists
                var existingConsole = await context.GameConsoles.FirstOrDefaultAsync(x => x.ConsoleID == console.Id);

                if (existingConsole != null)
                {
                    existingConsole.ConsoleName = console.Name;

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

            await context.SaveChangesAsync();
        }

        /// <summary>
        /// Gets the list of games for each console ID from the RetroAchievements API and inserts them into the RetroAchievementsApiData table for processing.
        /// </summary>
        /// <returns></returns>
        public async Task GetGamesFromConsoleIds()
        {
            var consoleIds = await context.GameConsoles.Select(x => x.ConsoleID).ToArrayAsync();

            if (consoleIds.Length == 0)
            {
                Log.Error("[RetroAchievements] No console IDs found in the database.");
                return;
            }

            // loop through each console ID and get the game list from the API
            foreach (var console in consoleIds)
            {
                var gameList = await raApiService.GetGameListFromConsoleId(console);

                if (gameList == null || gameList.Count == 0)
                {
                    Log.Error($"[RetroAchievements] No games found for console ID {console} in RetroAchievements API response.");
                    continue;
                }

                // Add the data into RetroAchievementsApiData table to be processed later
                // convert the dto into json string
                var jsonData = JsonConvert.SerializeObject(gameList);

                // make sure that the data does not already exist in the database
                if (await context.RetroAchievementsLogAndLoadData.AnyAsync(x => x.JsonData == jsonData && x.JobType == JobType.GetGameList && x.ProcessingStatus != ProcessingStatus.Errored))
                {
                    Log.Information($"[RetroAchievements] Game list data for console ID {console} already exists in the database. Skipping");
                    continue;
                }

                await context.RetroAchievementsLogAndLoadData.AddAsync(new RetroAchievementsLogAndLoadData
                {
                    JobType = JobType.GetGameList,
                    FailedProcessingAttempts = 0,
                    JsonData = jsonData,
                    LastUpdate = DateTime.UtcNow,
                    ProcessingStatus = ProcessingStatus.NotScheduled
                });

                await context.SaveChangesAsync();
                Log.Information($"[RetroAchievements] Game list data for console ID {console} added to the database for processing.");
                await Task.Delay(1000); // To avoid hitting the API too fast
            }
        }

        /// <summary>
        /// Gets game data for all unprocessed games from the RetroAchievements API and inserts them into the RetroAchievementsApiData table for processing.
        /// </summary>
        /// <param name="processEntireDatabase">Only to be used when the entire database needs updating which is very rare</param>
        /// <returns></returns>
        public async Task GetGameDataForUnprocessedGames(bool processEntireDatabase = false)
        {
            //Get all the new unprocessed games
            var unprocessedGames = Array.Empty<int>();

            if (!processEntireDatabase)
            {
                unprocessedGames = await context.Games.Where(x => !x.ExtraDataProcessed).Select(x => x.Id).ToArrayAsync();
                Log.Information("[RetroAchievements] Processing only unprocessed games.");
            }
            else
            {
                unprocessedGames = await context.Games.Select(x => x.Id).ToArrayAsync();
                Log.Information("[RetroAchievements] Processing all games in the database.");
            }

            if (unprocessedGames.Length == 0)
            {
                Log.Information("[RetroAchievements] No unprocessed games found.");
                return;
            }

            Log.Information($"[RetroAchievements] Found {unprocessedGames.Length} unprocessed games. Processing...");

            // Loop through each unprocessed game and get the game data from the API
            foreach (var gameId in unprocessedGames)
            {
                // make sure we don't get the data from the database if it errors
                var response = await raApiService.GetSpecificGameInfo(gameId, false);

                if (response == null)
                {
                    Log.Error($"[RetroAchievements] No data found for game ID {gameId} in RetroAchievements API response.");
                    continue;
                }

                // convert the dto into json string
                var jsonData = JsonConvert.SerializeObject(response);

                // make sure that the data does not already exist in the database
                if (await context.RetroAchievementsLogAndLoadData.AnyAsync(x => x.JsonData == jsonData && x.JobType == JobType.GetInitialGameData && x.ProcessingStatus != ProcessingStatus.Errored))
                {
                    Log.Information($"[RetroAchievements] Game data for game ID {gameId} already exists in the database. Skipping");
                    continue;
                }

                await context.RetroAchievementsLogAndLoadData.AddAsync(new RetroAchievementsLogAndLoadData
                {
                    JobType = JobType.GetInitialGameData,
                    FailedProcessingAttempts = 0,
                    JsonData = jsonData,
                    LastUpdate = DateTime.UtcNow,
                    ProcessingStatus = ProcessingStatus.NotScheduled
                });

                await context.SaveChangesAsync();
                Log.Information($"[RetroAchievements] Game data for game ID {gameId} added to the database for processing.");

                await Task.Delay(1000); // To avoid hitting the API too fast
            }
        }

        /// <summary>
        /// Gets game data for recently modified games from the RetroAchievements API and inserts them into the RetroAchievementsApiData table for processing.
        /// </summary>
        /// <returns></returns>
        public async Task GetGameDataForRecentlyModifiedGames()
        {
            // get all games that have been modified in the last 4 days
            // covers for any api downtime or issues
            // only get games that have not been processed yet as the unprocessed ones will be handled by the GetGameDataForUnprocessedGames method
            var modifiedGames = await context.Games
                .Where(x => x.LastModified > DateTime.UtcNow.AddDays(-4) && x.ExtraDataProcessed)
                .Select(x => x.Id)
                .ToArrayAsync();

            if (modifiedGames.Length == 0)
            {
                Log.Information("[RetroAchievements] No recently modified games found.");
                return;
            }

            Log.Information($"[RetroAchievements] Found {modifiedGames.Length} recently modified games. Processing...");

            foreach (var gameId in modifiedGames)
            {
                // make sure we don't get the data from the database if it errors
                var response = await raApiService.GetSpecificGameInfo(gameId, false);

                if (response == null)
                {
                    Log.Error($"[RetroAchievements] No data found for game ID {gameId} in RetroAchievements API response.");
                    continue;
                }

                // convert the dto into json string
                var jsonData = JsonConvert.SerializeObject(response);

                // make sure that the data does not already exist in the database
                // this'll also mean that if there are no changes to the game data, it won't be processed again
                if (await context.RetroAchievementsLogAndLoadData.AnyAsync(x => x.JsonData == jsonData && x.JobType == JobType.GetInitialGameData && x.ProcessingStatus != ProcessingStatus.Errored))
                {
                    Log.Information($"[RetroAchievements] Game data for game ID {gameId} already exists in the database. Skipping");
                    continue;
                }

                await context.RetroAchievementsLogAndLoadData.AddAsync(new RetroAchievementsLogAndLoadData
                {
                    JobType = JobType.GetRecentlyModifiedGameData,
                    FailedProcessingAttempts = 0,
                    JsonData = jsonData,
                    LastUpdate = DateTime.UtcNow,
                    ProcessingStatus = ProcessingStatus.NotScheduled
                });

                await context.SaveChangesAsync();
                Log.Information($"[RetroAchievements] Game data for game ID {gameId} added to the database for processing.");

                await Task.Delay(1000); // To avoid hitting the API too fast
            }
        }

        public async Task QueueUserGameUpdate(string username)
        {
            await context.RetroAchievementsLogAndLoadData.AddAsync(new RetroAchievementsLogAndLoadData
            {
                JobType = JobType.UserUpdate,
                JsonData = username,
                FailedProcessingAttempts = 0,
                ProcessingStatus = ProcessingStatus.NotScheduled,
                LastUpdate = DateTime.UtcNow
            });

            await context.SaveChangesAsync();

            Log.Information($"[RetroAchievements] User game update for {username} queued for processing.");
        }
    }
}
