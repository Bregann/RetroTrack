using Hangfire;
using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces;
using Serilog;

namespace RetroTrack.Domain.Services
{
    public class RetroAchievementsJobManagerService(AppDbContext context, IBackgroundJobClient backgroundJobClient) : IRetroAchievementsJobManagerService
    {
        // This service is responsible for dispatching jobs to be processed by the RetroAchievementsJobProcessorService
        // It will queue unscheduled jobs based on a limit and their processing status.
        // It will also clean up any jobs that have been processed or are stuck in the scheduled state.

        private readonly int _queueLimit = 20;

        /// <summary>
        /// Queues unscheduled jobs to be processed by the RetroAchievementsJobProcessorService.
        /// </summary>
        /// <returns></returns>
        public async Task QueueUnscheduledJobs()
        {
            // check how many there are to process, if there are none, return
            var requestsToProcess = await context.RetroAchievementsLogAndLoadData.Where(x => x.ProcessingStatus == ProcessingStatus.NotScheduled).CountAsync();

            if (requestsToProcess == 0)
            {
                return;
            }

            Log.Information($"[RetroAchievements] There are {requestsToProcess} requests to process");

            // check how many are already scheduled, if there are more than the limit, return
            var scheduledRequests = await context.RetroAchievementsLogAndLoadData.Where(x => x.ProcessingStatus == ProcessingStatus.Scheduled || x.ProcessingStatus == ProcessingStatus.BeingProcessed).CountAsync();

            if (scheduledRequests >= _queueLimit)
            {
                Log.Information($"[RetroAchievements] There are {scheduledRequests} requests already scheduled, not queuing more");
                return;
            }

            // get the number of requests to queue
            var requestsToQueue = _queueLimit - scheduledRequests;

            // get the unscheduled requests and update their status to scheduled
            var unscheduledRequests = await context.RetroAchievementsLogAndLoadData
                .Where(x => x.ProcessingStatus == ProcessingStatus.NotScheduled)
                .Take(requestsToQueue)
                .ToListAsync();

            // Loop through the unscheduled requests, schedule them, and update their status
            foreach (var request in unscheduledRequests)
            {
                switch (request.JobType)
                {
                    case JobType.GetGameList:
                        backgroundJobClient.Enqueue<IRetroAchievementsJobProcessorService>(processor => processor.ProcessGetGameListJob(request.Id));
                        break;
                    case JobType.GetExtendedGameData:
                        backgroundJobClient.Enqueue<IRetroAchievementsJobProcessorService>(processor => processor.ProcessGetExtendedGameDataJob(request.Id));
                        break;
                    case JobType.UserUpdate:
                        backgroundJobClient.Enqueue<IRetroAchievementsJobProcessorService>(processor => processor.ProcessUserUpdateJob(request.Id));
                        break;
                    case JobType.GetGameProgression:
                        backgroundJobClient.Enqueue<IRetroAchievementsJobProcessorService>(processor => processor.ProcessGetGameProgressionJob(request.Id));
                        break;
                }

                request.ProcessingStatus = ProcessingStatus.Scheduled;
                await context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Requeues errored jobs that have failed processing attempts less than 3.
        /// </summary>
        /// <returns></returns>
        public async Task RequeueErroredJobs()
        {
            // get all the errored jobs that have failed processing attempts less than 3
            var erroredJobs = await context.RetroAchievementsLogAndLoadData
                .Where(x => x.ProcessingStatus == ProcessingStatus.Errored && x.FailedProcessingAttempts < 3)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(y => y.ProcessingStatus, ProcessingStatus.NotScheduled));

            if (erroredJobs != 0)
            {
                Log.Information($"[RetroAchievements] Requeued {erroredJobs} errored jobs for processing.");
            }
        }

        /// <summary>
        /// Cleans up completed jobs that are older than 1 day.
        /// </summary>
        /// <returns></returns>
        public async Task CleanUpCompletedJobs()
        {
            // clean up completed jobs that are older than 1 day
            var completedJobs = await context.RetroAchievementsLogAndLoadData
                .Where(x => x.ProcessingStatus == ProcessingStatus.Processed && x.LastUpdate < DateTime.UtcNow.AddDays(-1))
                .ExecuteDeleteAsync();

            if (completedJobs != 0)
            {
                Log.Information($"[RetroAchievements] Cleaned up {completedJobs} completed jobs older than 1 day.");
            }
        }
    }
}
