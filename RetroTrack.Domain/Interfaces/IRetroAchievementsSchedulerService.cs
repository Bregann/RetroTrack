namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsSchedulerService
    {
        Task GetConsolesAndInsertToDatabase();
        Task GetGameDataForRecentlyModifiedGames();
        Task GetGameDataForUnprocessedGames(bool processEntireDatabase = false);
        Task GetGameProgressionDataForEligibleGames(bool processEntireDatabase = false);
        Task GetGamesFromConsoleIds();
        Task QueueUserGameUpdate(string username, int userId);
    }
}
