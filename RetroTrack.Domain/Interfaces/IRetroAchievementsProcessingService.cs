namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsProcessingService
    {
        Task GetConsolesAndInsertToDatabase();
        Task GetGameDataForRecentlyModifiedGames();
        Task GetGameDataForUnprocessedGames(bool processEntireDatabase = false);
        Task GetGamesFromConsoleIds();
    }
}
