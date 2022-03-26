using Quartz;
using Quartz.Impl;
using RetroAchievementTracker.RetroAchievementsAPI;
using Serilog;

namespace RetroAchievementTracker.Services
{
    public class JobScheduler
    {
        private static StdSchedulerFactory _factory;
        private static IScheduler _scheduler;

        public static async Task SetupQuartz()
        {
            //construct the scheduler factory
            _factory = new StdSchedulerFactory();
            _scheduler = await _factory.GetScheduler();
            await _scheduler.Start();

            //Game updating
            var gameUpdatingTrigger = TriggerBuilder.Create().WithIdentity("gameUpdatingTrigger").WithCronSchedule("0 0 4 1/1 * ? *").Build();
            var gameUpdating = JobBuilder.Create<UpdateGamesJob>().WithIdentity("gameUpdating").Build();

            //Mass update of games with 0 achievements

            await _scheduler.ScheduleJob(gameUpdating, gameUpdatingTrigger);

            Log.Information("[Job Scheduler] Job Scheduler Setup");
        }
    }

    internal class UpdateGamesJob : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            await RetroAchievements.GetConsoleIDsAndInsertToDb();
            await RetroAchievements.GetGamesFromConsoleIdsAndUpdateGameCounts();
            await RetroAchievements.UpdateUnprocessedGames();
        }
    }
}
