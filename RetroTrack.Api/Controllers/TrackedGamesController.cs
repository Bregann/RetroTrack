using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.TrackedGames.Requests;
using RetroTrack.Domain.DTOs.Controllers.TrackedGames.Responses;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class TrackedGamesController(ITrackedGamesControllerDataService trackedGamesControllerData, IUserContextHelper userContextHelper) : ControllerBase
    {
        [HttpPost("{gameId}")]
        public async Task<ActionResult> AddTrackedGame([FromRoute] int gameId)
        {
            var user = userContextHelper.GetUserId();

            try
            {
                await trackedGamesControllerData.AddNewTrackedGame(user, gameId);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{gameId}")]
        public async Task<ActionResult> DeleteTrackedGame([FromRoute] int gameId)
        {
            var user = userContextHelper.GetUserId();

            try
            {
                await trackedGamesControllerData.RemoveTrackedGame(user, gameId);
                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        public async Task<GetUserTrackedGamesResponse> GetTrackedGamesForUser([FromQuery] GetUserTrackedGamesRequest request)
        {
            var user = userContextHelper.GetUserId();

            var trackedGames = await trackedGamesControllerData.GetTrackedGamesForUser(user, request);
            return trackedGames;
        }
    }
}
