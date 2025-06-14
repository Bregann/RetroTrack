using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.DTOs.Controllers.Games.Responses;
using RetroTrack.Domain.DTOs.Helpers;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IGamesControllerDataService
    {
        Task<GetRecentlyAddedAndUpdatedGamesResponse> GetRecentlyAddedAndUpdatedGames();
        Task<UserConsoleGamesDto?> GetGamesAndUserProgressForConsole(UserDataDto userData, int consoleId);
        Task<PublicConsoleGamesDto?> GetGamesForConsole(int consoleId);
        Task<List<UserGamesTableDto>> GetInProgressGamesForUser(UserDataDto userData);
        Task<GameInfoDto?> GetSpecificGameInfo(int gameId);
        Task<UserAchievementsForGameDto> GetUserAchievementsForGame(UserDataDto userData, int gameId);
        Task<UserGameInfoDto?> GetUserGameInfo(UserDataDto userData, int gameId);
    }
}
