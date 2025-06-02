using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.OldCode.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IGamesControllerDataService
    {
        UserConsoleGamesDto? GetGamesAndUserProgressForConsole(string username, int consoleId);
        PublicConsoleGamesDto? GetGamesForConsole(int consoleId);
        List<UserGamesTableDto> GetInProgressGamesForUser(string username);
        List<DayListDto> GetNewAndUpdatedGamesFromLast5Days();
        Task<GameInfoDto?> GetSpecificGameInfo(int gameId);
        Task<UserAchievementsForGameDto> GetUserAchievementsForGame(string username, int gameId);
        Task<UserGameInfoDto?> GetUserGameInfo(string username, int gameId);
    }
}
