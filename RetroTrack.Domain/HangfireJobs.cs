using Hangfire;
using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Data.External;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Enums;
using Serilog;

namespace RetroTrack.Domain
{
    public class HangfireJobs
    {
        public static void SetupHangfireJobs()
        {
            RecurringJob.AddOrUpdate("GetConsolesAndInsertToDatabaseJob", () => GetConsolesAndInsertToDatabaseJob(), "0 0 * * *");
            RecurringJob.AddOrUpdate("CleanupLogAndLoadData", () => CleanupLogAndLoadData(), "0 0 * * *");
            RecurringJob.AddOrUpdate("GetGamesFromConsoleIdsJob", () => GetGamesFromConsoleIdsJob(), "0 */6 * * *");
            RecurringJob.AddOrUpdate("GetUnprocessedGameData", () => GetUnprocessedGameDataJob(), "10 */6 * * *");
            RecurringJob.AddOrUpdate("UpdateGameDataFromRecentlyUpdatedGames", () => UpdateGameDataFromRecentlyUpdatedGames(), "30 0 * * *");
            RecurringJob.AddOrUpdate("QueueLogAndLoadJob", () => QueueLogAndLoadJob(), "*/20 * * * * *");
        }

        public static async Task GetConsolesAndInsertToDatabaseJob()
        {
            await RetroAchievements.GetConsolesAndInsertToDatabase();
        }

        public static async Task GetGamesFromConsoleIdsJob()
        {
            await RetroAchievements.GetGamesFromConsoleIds();
        }

        public static async Task GetUnprocessedGameDataJob()
        {
            await RetroAchievements.GetUnprocessedGameData();
        }

        public static async Task UpdateGameDataFromRecentlyUpdatedGames()
        {
            await RetroAchievements.GetRecentlyModifiedGamesGameData();
        }

        public static async Task CleanupLogAndLoadData()
        {
            using(var context = new DatabaseContext())
            {
                var processedDataDeletedCount = await context.RetroAchievementsApiData.Where(x => x.LastUpdate.Date <= DateTime.UtcNow.AddDays(-2) && x.ProcessingStatus == ProcessingStatus.Processed).ExecuteDeleteAsync();
                Log.Information($"[LogAndLoad] Cleaned up {processedDataDeletedCount} processed requests");
            }
        }

        public static void QueueLogAndLoadJob()
        {
            var maxRequests = 20;

            using (var context = new DatabaseContext())
            {
                //Check for any scheduled jobs that have not been updated within the last 2 minutes and reset them if nothing has happened to them
                var requestsStuckAsScheduled = context.RetroAchievementsApiData.Where(x => x.ProcessingStatus == ProcessingStatus.Scheduled && DateTime.UtcNow > x.LastUpdate.AddMinutes(2)).ToList();

                if (requestsStuckAsScheduled.Count != 0)
                {
                    Log.Information($"[RetroAchievements] There are {requestsStuckAsScheduled.Count} stuck jobs");

                    foreach (var job in requestsStuckAsScheduled)
                    {
                        job.ProcessingStatus = ProcessingStatus.NotScheduled;
                    }

                    context.UpdateRange(requestsStuckAsScheduled);
                    context.SaveChanges();
                }

                var requestsToProcess = context.RetroAchievementsApiData.Where(x => x.ProcessingStatus == ProcessingStatus.NotScheduled).Count();

                if (requestsToProcess == 0)
                {
                    return;
                }

                Log.Information($"[RetroAchievements] There are {requestsToProcess} requests to process");

                var activeRequests = context.RetroAchievementsApiData.Where(x => x.ProcessingStatus == ProcessingStatus.Scheduled || x.ProcessingStatus == ProcessingStatus.BeingProcessed).Count();
                var requestsToSend = maxRequests - activeRequests;

                var rowsToSchedule = context.RetroAchievementsApiData.Where(x => x.ProcessingStatus == ProcessingStatus.NotScheduled)
                    .Take(requestsToSend)
                    .ToList();

                Log.Information($"[RetroAchievements] {rowsToSchedule.Count} requests ready to process");

                foreach (var id in rowsToSchedule)
                {
                    //Check the api request type and send enqueue the right job
                    switch (id.ApiRequestType)
                    {
                        case ApiRequestType.GetGameList:
                            BackgroundJob.Enqueue(() => RetroAchievements.AddOrUpdateGamesToDatabase(id.Id));
                            break;

                        case ApiRequestType.GetGameExtended:
                            BackgroundJob.Enqueue(() => RetroAchievements.AddOrUpdateExtraGameInfoToDatabase(id.Id));
                            break;

                        case ApiRequestType.UserUpdate:
                            BackgroundJob.Enqueue(() => RetroAchievements.GetUserGames(id.JsonData, id.Id)); //this is the username
                            break;
                    }

                    context.RetroAchievementsApiData.First(x => x.Id == id.Id).ProcessingStatus = ProcessingStatus.Scheduled;
                    context.SaveChanges();

                    Log.Information($"[RetroAchievements] request id {id.Id} scheduled to send");
                }
            }
        }
    }
}