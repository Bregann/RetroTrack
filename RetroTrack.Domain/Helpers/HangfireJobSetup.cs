using Hangfire;
using RetroTrack.Domain.Interfaces;
using Serilog;

namespace RetroTrack.Domain.Helpers
{
    public class HangfireJobSetup
    {
        public static void RegisterJobs()
        {
#if DEBUG

#else
            RecurringJob.AddOrUpdate<IRetroAchievementsJobManagerService>("QueueUnscheduledJobs", service => service.QueueUnscheduledJobs(), "*/15 * * * * *");
            RecurringJob.AddOrUpdate<IRetroAchievementsJobManagerService>("CleanUpCompletedJobs", service => service.CleanUpCompletedJobs(), "0 0 * * *");
            RecurringJob.AddOrUpdate<IRetroAchievementsJobManagerService>("CleanUpStuckJobs", service => service.RequeueErroredJobs(), "* */1 * * *");

            RecurringJob.AddOrUpdate<IRetroAchievementsSchedulerService>("GetConsolesAndInsertToDatabaseJob", service => service.GetConsolesAndInsertToDatabase(), "0 0 * * *");
            RecurringJob.AddOrUpdate<IRetroAchievementsSchedulerService>("GetGamesFromConsoleIdsJob", service => service.GetGamesFromConsoleIds(), "0 */6 * * *");
            RecurringJob.AddOrUpdate<IRetroAchievementsSchedulerService>("GetUnprocessedGameDataJob", service => service.GetGameDataForUnprocessedGames(false), "10 */6 * * *");
            RecurringJob.AddOrUpdate<IRetroAchievementsSchedulerService>("GetGameDataForRecentlyModifiedGamesJob", service => service.GetGameDataForRecentlyModifiedGames(), "30 0 * * *");

            Log.Information("[Hangfire] Jobs have been registered successfully.");
#endif
        }
    }
}