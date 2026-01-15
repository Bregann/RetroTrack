namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsJobProcessorService
    {
        Task ProcessGetExtendedGameDataJob(int requestId);
        Task ProcessGetGameListJob(int requestId);
        Task ProcessGetGameProgressionJob(int requestId);
        Task ProcessUserUpdateJob(int requestId);
    }
}
