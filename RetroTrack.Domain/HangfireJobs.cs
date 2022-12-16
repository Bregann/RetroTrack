using Hangfire;
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
            RecurringJob.AddOrUpdate("GetGamesFromConsoleIdsJob", () => GetGamesFromConsoleIdsJob(), "0 */6 * * *");
            RecurringJob.AddOrUpdate("GetUnprocessedGameData", () => GetUnprocessedGameDataJob(), "10 */6 * * *");
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

        public static void QueueLogAndLoadJob()
        {
            var maxRequests = 20;

            using (var context = new DatabaseContext())
            {
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