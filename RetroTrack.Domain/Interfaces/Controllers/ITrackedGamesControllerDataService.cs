using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.DTOs.Helpers;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ITrackedGamesControllerDataService
    {
        Task<bool> AddNewTrackedGame(UserDataDto userData, int gameId);
        Task<List<UserGamesTableDto>> GetTrackedGamesForUser(UserDataDto userData);
        Task<bool> RemoveTrackedGame(UserDataDto userData, int gameId);
    }
}
