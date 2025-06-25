using RetroTrack.Domain.DTOs.Controllers.TrackedGames.Requests;
using RetroTrack.Domain.DTOs.Controllers.TrackedGames.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ITrackedGamesControllerDataService
    {
        Task AddNewTrackedGame(int userId, int gameId);
        Task<GetUserTrackedGamesResponse> GetTrackedGamesForUser(int userId, GetUserTrackedGamesRequest request);
        Task RemoveTrackedGame(int userId, int gameId);
    }
}
