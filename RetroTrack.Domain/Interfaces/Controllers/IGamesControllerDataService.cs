using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.DTOs.Controllers.Games.Requests;
using RetroTrack.Domain.DTOs.Controllers.Games.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IGamesControllerDataService
    {
        Task<GetRecentlyAddedAndUpdatedGamesResponse> GetRecentlyAddedAndUpdatedGames();
        Task<GetGamesForConsoleResponse> GetGamesForConsole(GetGamesForConsoleRequest request);
        Task<GetPublicSpecificGameInfoResponse?> GetPublicSpecificGameInfoResponse(int gameId);


        Task<UserConsoleGamesDto?> GetGamesAndUserProgressForConsole(int userId, string username, int consoleId);
        Task<List<UserGamesTableDto>> GetInProgressGamesForUser(int userId);
        Task<UserAchievementsForGameDto> GetUserAchievementsForGame(int userId, int gameId);
        Task<UserGameInfoDto?> GetUserGameInfo(int userId, int gameId);
    }
}
