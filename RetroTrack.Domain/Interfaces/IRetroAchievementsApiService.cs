using RetroTrack.Domain.DTOs.RetroAchievementsApi;

namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsApiService
    {
        Task<List<ConsoleIDs>?> GetConsoleIds();
        Task<GetGameLeaderboards?> GetGameLeaderboards(int gameId, int skipAmount = 0, int count = 500);
        Task<List<GetGameList>?> GetGameListFromConsoleId(int consoleId);
        Task<GetGameProgression?> GetGameProgression(int gameId);
        Task<GetGame?> GetGameSummary(int gameId);
        Task<GetGameExtended?> GetSpecificGameInfo(int gameId, bool returnDatabaseData = true, bool fallBackData = false);
        Task<GetGameInfoAndUserProgress?> GetSpecificGameInfoAndUserProgress(string username, string ulid, int gameId);
        Task<GetUserCompletionProgress?> GetUserCompletionProgress(string username, string ulid, int skipAmount = 0, int count = 500);
        Task<GetUserProfile?> GetUserProfile(string username, string ulid);
        Task<GetUserProfile?> GetUserProfileFromUsername(string username);
        Task<(bool IsValidKey, string UsernameUlid)> ValidateApiKey(string username, string raApiKey);
    }
}
