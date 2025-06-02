using RetroTrack.Domain.DTOs.Controllers.Games;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ITrackedGamesControllerDataService
    {
        bool AddNewTrackedGame(string username, int gameId);
        List<UserGamesTableDto> GetTrackedGamesForUser(string username);
        bool RemoveTrackedGame(string username, int gameId);
    }
}
