using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.DTOs.Controllers.Games.Requests;
using RetroTrack.Domain.DTOs.Controllers.Games.Responses;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers.Games
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GamesController(IGamesControllerDataService gamesControllerData, IAuthHelperService authHelperService) : ControllerBase
    {
        [HttpGet]
        public async Task<GetRecentlyAddedAndUpdatedGamesResponse> GetRecentlyAddedAndUpdatedGames()
        {
            return await gamesControllerData.GetRecentlyAddedAndUpdatedGames();
        }

        [HttpGet]
        public async Task<GetGamesForConsoleResponse> GetGamesForConsole([FromQuery] GetGamesForConsoleRequest request)
        {
            return await gamesControllerData.GetGamesForConsole(request);
        }

        [HttpGet("{gameId}")]
        public async Task<ActionResult<GameInfoDto>> GetSpecificGameInfo([FromRoute] int gameId)
        {
            var data = await gamesControllerData.GetSpecificGameInfo(gameId);

            if (data == null)
            {
                return Unauthorized(false);
            }

            return Ok(data);
        }

        [HttpGet("{gameId}")]
        public async Task<ActionResult<UserGameInfoDto>> GetGameInfoForUser([FromRoute] int gameId)
        {
            var user = authHelperService.ValidateSessionIdAndReturnUserData(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            var data = await gamesControllerData.GetUserGameInfo(user, gameId);

            return Ok(data);
        }

        [HttpGet]
        public async Task<ActionResult<UserAchievementsForGameDto>> GetUserAchievementsForGame(int gameId)
        {
            var user = authHelperService.ValidateSessionIdAndReturnUserData(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            var data = await gamesControllerData.GetUserAchievementsForGame(user, gameId);

            return Ok(data);
        }


        [HttpGet("{consoleId}")]
        public async Task<ActionResult<UserConsoleGamesDto>> GetGamesAndUserProgressForConsole([FromRoute] int consoleId)
        {
            var user = authHelperService.ValidateSessionIdAndReturnUserData(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            var games = await gamesControllerData.GetGamesAndUserProgressForConsole(user, consoleId);

            if (games == null)
            {
                return BadRequest();
            }

            return Ok(games);
        }

        [HttpGet]
        public async Task<ActionResult<List<UserGamesTableDto>>> GetUserInProgressGames()
        {
            var user = authHelperService.ValidateSessionIdAndReturnUserData(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            var trackedGames = await gamesControllerData.GetInProgressGamesForUser(user);
            return Ok(trackedGames);
        }

        //Get undevved games
    }
}