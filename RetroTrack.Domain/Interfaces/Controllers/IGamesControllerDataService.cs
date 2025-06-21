using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.DTOs.Controllers.Games.Requests;
using RetroTrack.Domain.DTOs.Controllers.Games.Responses;
using RetroTrack.Domain.DTOs.Helpers;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IGamesControllerDataService
    {
        Task<GetRecentlyAddedAndUpdatedGamesResponse> GetRecentlyAddedAndUpdatedGames();
        Task<GetGamesForConsoleResponse> GetGamesForConsole(GetGamesForConsoleRequest request);
        Task<GetPublicSpecificGameInfoResponse?> GetPublicSpecificGameInfoResponse(int gameId);


        Task<UserConsoleGamesDto?> GetGamesAndUserProgressForConsole(UserDataDto userData, int consoleId);
        Task<List<UserGamesTableDto>> GetInProgressGamesForUser(UserDataDto userData);
        Task<UserAchievementsForGameDto> GetUserAchievementsForGame(UserDataDto userData, int gameId);
        Task<UserGameInfoDto?> GetUserGameInfo(UserDataDto userData, int gameId);
    }
}
