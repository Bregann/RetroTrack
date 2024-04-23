using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Api.Controllers.TrackedGames
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TrackedGamesController : ControllerBase
    {
        [HttpPost("{gameId}")]
        public ActionResult<bool> AddTrackedGame([FromRoute] int gameId)
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            if (TrackedGamesData.AddNewTrackedGame(user, gameId))
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpDelete("{gameId}")]
        public ActionResult DeleteTrackedGame([FromRoute] int gameId)
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            if (TrackedGamesData.RemoveTrackedGame(user, gameId))
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpGet]
        public ActionResult<List<UserGamesTableDto>> GetTrackedGamesForUser()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            var trackedGames = TrackedGamesData.GetTrackedGamesForUser(user);
            return Ok(trackedGames);
        }

        //Get tracked dev list games
        //Delete tracked dev list games
        //Add tracked dev list games
    }
}