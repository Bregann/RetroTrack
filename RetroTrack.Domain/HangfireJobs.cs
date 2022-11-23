using Hangfire;
using Hangfire.Storage.Monitoring;
using RetroTrack.Domain.Data.External;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Enums;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain
{
    public class HangfireJobs
    {
        public static void SetupHangfireJobs()
        {
            RecurringJob.AddOrUpdate("GetConsolesAndInsertToDatabaseJob", () => GetConsolesAndInsertToDatabaseJob(), "0 0 * * *");
            RecurringJob.AddOrUpdate("GetGamesFromConsoleIdsJob", () => GetGamesFromConsoleIdsJob(), "0 */6 * * *");
            RecurringJob.AddOrUpdate("GetGamesFromConsoleIdsJob", () => QueueGamesToUpdateJob(), "*/20 * * * * *");
        }

        public static async Task GetConsolesAndInsertToDatabaseJob()
        {
            await RetroAchievements.GetConsolesAndInsertToDatabase();
        }

        public static async Task GetGamesFromConsoleIdsJob()
        {
            await RetroAchievements.GetGamesFromConsoleIds();
        }

        public static void QueueGamesToUpdateJob()
        {
            var maxRequests = 10;

            using(var context = new DatabaseContext())
            {
                var requestsToProcess = context.RetroAchievementsApiData.Where(x => x.ProcessingStatus == ProcessingStatus.NotScheduled).Count();

                if (requestsToProcess == 0)
                {
                    return;
                }

                Log.Information($"[RetroAchievements] There are {requestsToProcess} game api requests to process");

                var activeRequests = context.RetroAchievementsApiData.Where(x => x.ProcessingStatus == ProcessingStatus.Scheduled || x.ProcessingStatus == ProcessingStatus.BeingProcessed).Count();
                var requestsToSend = maxRequests - activeRequests;

                Log.Information($"[RetroAchievements] {requestsToSend} game api requests ready to process");

                var rowsToSchedule = context.RetroAchievementsApiData.Where(x => x.ProcessingStatus == ProcessingStatus.NotScheduled)
                    .Select(x => x.Id)
                    .Take(requestsToSend)
                    .ToList();

                foreach (var id in rowsToSchedule)
                {
                    BackgroundJob.Enqueue(() => RetroAchievements.AddOrUpdateGamesToDatabase(id));
                    context.RetroAchievementsApiData.First(x => x.Id == id).ProcessingStatus = ProcessingStatus.Scheduled;
                    context.SaveChanges();

                    Log.Information($"[RetroAchievements] game api requests id {id} scheduled to send");
                }
            }
        }
    }
}
