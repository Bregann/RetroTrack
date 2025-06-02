using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers.TrackedGames
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TrackedGamesController(ITrackedGamesControllerDataService trackedGamesControllerData, IAuthHelperService authHelper) : ControllerBase
    {
        [HttpPost("{gameId}")]
        public ActionResult<bool> AddTrackedGame([FromRoute] int gameId)
        {
            var user = authHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            if (trackedGamesControllerData.AddNewTrackedGame(user, gameId))
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
            var user = authHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            if (trackedGamesControllerData.RemoveTrackedGame(user, gameId))
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
            var user = authHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            var trackedGames = trackedGamesControllerData.GetTrackedGamesForUser(user);
            return Ok(trackedGames);
        }

        //Get tracked dev list games
        //Delete tracked dev list games
        //Add tracked dev list games
    }
}