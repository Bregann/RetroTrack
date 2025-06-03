using RetroTrack.Domain.DTOs.RetroAchievementsApi;

namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsApiService
    {
        Task<List<ConsoleIDs>?> GetConsoleIds();
        Task<List<GetGameList>?> GetGameListFromConsoleId(int consoleId);
        Task<GetGameExtended?> GetSpecificGameInfo(int gameId, bool returnDatabaseData = true);
        Task<GetGameInfoAndUserProgress?> GetSpecificGameInfoAndUserProgress(string username, int gameId);
        Task<GetUserCompletionProgress?> GetUserCompletionProgress(string username, int skipAmount = 0, int count = 500);
        Task<GetUserProfile?> GetUserProfile(string username);
        Task<bool> ValidateApiKey(string username, string raApiKey);
    }
}
