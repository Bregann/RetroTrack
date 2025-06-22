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
    public class GamesController(IGamesControllerDataService gamesControllerData, IUserContextHelper userContextHelper) : ControllerBase
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
        public async Task<ActionResult<GetPublicSpecificGameInfoResponse>> GetPublicSpecificGameInfo([FromRoute] int gameId)
        {
            var data = await gamesControllerData.GetPublicSpecificGameInfo(gameId);

            if (data == null)
            {
                return BadRequest(false);
            }

            return Ok(data);
        }



        [HttpGet("{gameId}")]
        public async Task<ActionResult<GetLoggedInSpecificGameInfoResponse>> GetGameInfoForUser([FromRoute] int gameId)
        {
            var user = userContextHelper.GetUserId();

            var data = await gamesControllerData.GetLoggedInSpecificGameInfo(user, gameId);

            return Ok(data);
        }

        [HttpGet]
        public async Task<GetUserProgressForConsoleResponse> GetUserProgressForConsole([FromQuery] GetUserProgressForConsoleRequest request)
        {
            var user = userContextHelper.GetUserId();

            return await gamesControllerData.GetUserProgressForConsole(user, request);
        }

        [HttpGet]
        public async Task<ActionResult<List<UserGamesTableDto>>> GetUserInProgressGames()
        {
            var user = userContextHelper.GetUserId();

            var trackedGames = await gamesControllerData.GetInProgressGamesForUser(user);
            return Ok(trackedGames);
        }
    }
}