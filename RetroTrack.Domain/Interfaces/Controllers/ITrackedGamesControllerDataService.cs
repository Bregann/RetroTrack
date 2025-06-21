using RetroTrack.Domain.DTOs.Controllers.Games;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ITrackedGamesControllerDataService
    {
        Task<bool> AddNewTrackedGame(int userId, int gameId);
        Task<List<UserGamesTableDto>> GetTrackedGamesForUser(int userId);
        Task<bool> RemoveTrackedGame(int userId, int gameId);
    }
}
