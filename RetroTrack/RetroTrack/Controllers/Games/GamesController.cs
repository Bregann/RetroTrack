using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Api.Controllers.Games
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        [HttpGet("GetRecentlyAddedAndUpdatedGames")]
        public List<DayListDto> GetRecentlyAddedAndUpdatedGames()
        {
            return GamesData.GetNewAndUpdatedGamesFromLast5Days();
        }

        [HttpGet("GetSpecificGameInfo")]
        public async Task<ActionResult<GameInfoDto>> GetSpecificGameInfo(int gameId)
        {
            var data = await GamesData.GetSpecificGameInfo(gameId);

            if (data == null)
            {
                return Unauthorized();
            }

            return Ok(data);
        }

        [HttpGet("GetGameInfoForUser")]
        public async Task<ActionResult<UserGameInfoDto>> GetGameInfoForUser(int gameId)
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            var data = await GamesData.GetUserGameInfo(user, gameId);

            return Ok(data);
        }

        [HttpGet("GetUserAchievementsForGame")]
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

        [HttpGet("GetGamesForConsole")]
        public ActionResult<PublicConsoleGamesDto> GetGamesForConsole(int consoleId)
        {
            var games = Domain.Data.GamesData.GetGamesForConsole(consoleId);

            if (games == null)
            {
                return BadRequest();
            }

            return Ok(games);
        }

        [HttpGet("GetGamesAndUserProgressForConsole")]
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

        [HttpGet("GetUserInProgressGames")]
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