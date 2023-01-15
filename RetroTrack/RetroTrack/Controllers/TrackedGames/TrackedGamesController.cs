using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Api.Controllers.TrackedGames
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

            if (TrackedGamesData.AddNewTrackedGame(user, gameId))
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

            if (TrackedGamesData.RemoveTrackedGame(user, gameId))
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

            var trackedGames = TrackedGamesData.GetTrackedGamesForUser(user);
            return Ok(trackedGames);
        }

        //Get tracked dev list games
        //Delete tracked dev list games
        //Add tracked dev list games
    }
}