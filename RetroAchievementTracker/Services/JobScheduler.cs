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

            //Backup database
            var backupDatabaseTrigger = TriggerBuilder.Create().WithIdentity("backupDatabaseTrigger").WithCronSchedule("0 0 0/6 ? * * *").Build();
            var backupDatabase = JobBuilder.Create<BackUpDatabaseJob>().WithIdentity("backupDatabase").Build();

            await _scheduler.ScheduleJob(gameUpdating, gameUpdatingTrigger);
            await _scheduler.ScheduleJob(backupDatabase, backupDatabaseTrigger);

            Log.Information("[Job Scheduler] Job Scheduler Setup");
        }
    }

    internal class UpdateGamesJob : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            await RetroAchievements.UpdateGameAchievementCounts();
            await RetroAchievements.GetConsoleIDsAndInsertToDb();
            await RetroAchievements.GetGamesFromConsoleIdsAndUpdateGameCounts();
            await RetroAchievements.UpdateUnprocessedGames();
        }
    }

    internal class BackUpDatabaseJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            //get the directory
#if DEBUG
            var filePath = Directory.GetCurrentDirectory() + "\\Database";
            var directory = new DirectoryInfo(filePath);
#else
            var filePath = Directory.GetCurrentDirectory() + "/Database";
            var directory = new DirectoryInfo(filePath);
#endif
            //If there's more than 30 files then delete the oldest db there
            if (directory.GetFiles().Length > 30)
            {
                var oldestDb = directory.GetFiles().OrderBy(f => f.LastWriteTime).First();
                oldestDb.Delete();
                Log.Information($"[Database Backup] {oldestDb.FullName} has been deleted");
            }

            //Create a new copy
            var backupFileName = $"retroachievements-{DateTime.Now.Day}-{DateTime.Now.Month}-{DateTime.Now.Year}-{DateTime.Now.Hour}.db";

            File.Copy(Path.Combine(filePath, "retroachievements.db"), Path.Combine(filePath, backupFileName));
            Log.Information($"[Database Backup] Database backup succeeded. File {backupFileName} created");
            return Task.CompletedTask;
        }
    }
}
