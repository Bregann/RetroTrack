
namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsJobManagerService
    {
        Task CleanUpCompletedJobs();
        Task QueueUnscheduledJobs();
        Task RequeueErroredJobs();
    }
}
