using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers.TrackedGames
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TrackedGamesController(ITrackedGamesControllerDataService trackedGamesControllerData, IUserContextHelper userContextHelper) : ControllerBase
    {
        [HttpPost("{gameId}")]
        public async Task<ActionResult<bool>> AddTrackedGame([FromRoute] int gameId)
        {
            var user = userContextHelper.GetUserId();

            if (await trackedGamesControllerData.AddNewTrackedGame(user, gameId))
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpDelete("{gameId}")]
        public async Task<ActionResult> DeleteTrackedGame([FromRoute] int gameId)
        {
            var user = userContextHelper.GetUserId();

            if (await trackedGamesControllerData.RemoveTrackedGame(user, gameId))
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<UserGamesTableDto>>> GetTrackedGamesForUser()
        {
            var user = userContextHelper.GetUserId();

            var trackedGames = await trackedGamesControllerData.GetTrackedGamesForUser(user);
            return Ok(trackedGames);
        }
    }
}