using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Controllers.TrackedGames
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrackedGamesController : ControllerBase
    {
        [HttpPost("AddTrackedGame")]
        public ActionResult<bool> AddTrackedGame(int gameId)
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            if (Domain.Data.LoggedIn.TrackedGames.TrackedGames.AddNewTrackedGame(user, gameId))
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpDelete("DeleteTrackedGame")]
        public ActionResult DeleteTrackedGame(int gameId)
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            if (Domain.Data.LoggedIn.TrackedGames.TrackedGames.RemoveTrackedGame(user, gameId))
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpGet("GetTrackedGamesForUser")]
        public ActionResult<List<UserGamesTableDto>> GetTrackedGamesForUser()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            var trackedGames = Domain.Data.LoggedIn.TrackedGames.TrackedGames.GetTrackedGamesForUser(user);
            return Ok(trackedGames);
        }
    }
}
