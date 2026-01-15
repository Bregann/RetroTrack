namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsSchedulerService
    {
        Task GetConsolesAndInsertToDatabase();
        Task GetGameDataForRecentlyModifiedGames();
        Task GetGameDataForUnprocessedGames(bool processEntireDatabase = false);
        Task GetGameProgressionDataForEligibleGames();
        Task GetGamesFromConsoleIds();
        Task QueueUserGameUpdate(string username, int userId);
    }
}
