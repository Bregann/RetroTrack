using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;
using RetroTrack.Domain.Models;

namespace RetroTrack.Controllers.Games
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        [HttpGet("GetRecentlyAddedAndUpdatedGames")]
        public List<DayListDto> GetRecentlyAddedAndUpdatedGames()
        {
            return Domain.Data.Public.Games.Games.GetNewAndUpdatedGamesFromLast5Days();
        }

        [HttpGet("GetSpecificGameInfo")]
        public async Task<ActionResult<GameInfoDto>> GetSpecificGameInfo(int gameId)
        {
            var data = await Domain.Data.Public.Games.Games.GetSpecificGameInfo(gameId);

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

            var data = await Domain.Data.Public.Games.Games.GetUserGameInfo(user, gameId);

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

            var data = await Domain.Data.Public.Games.Games.GetUserAchievementsForGame(user, gameId);

            return Ok(data);
        }
    }
}
