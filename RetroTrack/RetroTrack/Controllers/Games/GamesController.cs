using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Api.Controllers.Games
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        [HttpGet]
        public List<DayListDto> GetRecentlyAddedAndUpdatedGames()
        {
            return GamesData.GetNewAndUpdatedGamesFromLast5Days();
        }

        [HttpGet("{gameId}")]
        public async Task<ActionResult<GameInfoDto>> GetSpecificGameInfo([FromRoute] int gameId)
        {
            var data = await GamesData.GetSpecificGameInfo(gameId);

            if (data == null)
            {
                return Unauthorized();
            }

            return Ok(data);
        }

        [HttpGet("{gameId}")]
        public async Task<ActionResult<UserGameInfoDto>> GetGameInfoForUser([FromRoute] int gameId)
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            var data = await GamesData.GetUserGameInfo(user, gameId);

            return Ok(data);
        }

        [HttpGet]
        public async Task<ActionResult<UserAchievementsForGameDto>> GetUserAchievementsForGame(int gameId)
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            var data = await GamesData.GetUserAchievementsForGame(user, gameId);

            return Ok(data);
        }

        [HttpGet("{consoleId}")]
        public ActionResult<PublicConsoleGamesDto> GetGamesForConsole([FromRoute] int consoleId)
        {
            var games = Domain.Data.GamesData.GetGamesForConsole(consoleId);

            if (games == null)
            {
                return BadRequest();
            }

            return Ok(games);
        }

        [HttpGet]
        public ActionResult<UserConsoleGamesDto> GetGamesAndUserProgressForConsole(int consoleId)
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            var games = GamesData.GetGamesAndUserProgressForConsole(user, consoleId);

            if (games == null)
            {
                return BadRequest();
            }

            return Ok(games);
        }

        [HttpGet]
        public ActionResult<List<UserGamesTableDto>> GetUserInProgressGames()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            var trackedGames = GamesData.GetInProgressGamesForUser(user);
            return Ok(trackedGames);
        }

        //Get undevved games
    }
}