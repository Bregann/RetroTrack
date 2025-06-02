using RetroTrack.Domain.OldCode.Models;

namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsApiService
    {
        Task<GetGameExtended?> GetSpecificGameInfo(int gameId);
        Task<bool> ValidateApiKey(string username, string raApiKey);
    }
}
