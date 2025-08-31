using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Playlists.Requests;
using RetroTrack.Domain.DTOs.Controllers.Playlists.Responses;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PlaylistController(IPlaylistControllerDataService playlistControllerDataService, IUserContextHelper userContextHelper) : ControllerBase
    {
        [HttpGet]
        public async Task<GetPlaylistResponse> GetPublicPlaylists([FromQuery] GetPlaylistRequest request)
        {
            return await playlistControllerDataService.GetPublicPlaylists(request);
        }

        [HttpGet]
        public async Task<ActionResult<GetPublicPlaylistDataResponse>> GetPublicPlaylistData([FromQuery] GetPublicPlaylistDataRequest request)
        {
            try
            {
                return await playlistControllerDataService.GetPublicPlaylistData(request);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<GetLoggedInPlaylistDataResponse>> GetLoggedInPlaylistData([FromQuery] GetLoggedInPlaylistDataRequest request)
        {
            var userId = userContextHelper.GetUserId();
            try
            {
                return await playlistControllerDataService.GetLoggedInPlaylistData(userId, request);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<GetPlaylistResponse> GetUserPlaylists([FromQuery] GetPlaylistRequest request)
        {
            var userId = userContextHelper.GetUserId();

            return await playlistControllerDataService.GetUserPlaylists(userId, request);
        }

        [HttpGet]
        [Authorize]
        public async Task<GetPlaylistResponse> GetUserLikedPlaylists([FromQuery] GetPlaylistRequest request)
        {
            var userId = userContextHelper.GetUserId();

            return await playlistControllerDataService.GetUserLikedPlaylists(userId, request);
        }

        [HttpPost]
        [Authorize]
        public async Task AddNewPlaylist([FromBody] AddNewPlaylistRequest request)
        {
            var userId = userContextHelper.GetUserId();

            await playlistControllerDataService.AddNewPlaylist(userId, request);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddGameToPlaylist([FromBody] AddGameToPlaylistRequest request)
        {
            var userId = userContextHelper.GetUserId();
            try
            {
                await playlistControllerDataService.AddGameToPlaylist(request, userId);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        public async Task<ActionResult> RemoveGamesFromPlaylist([FromBody] RemoveGamesFromPlaylist request)
        {
            var userId = userContextHelper.GetUserId();
            try
            {
                await playlistControllerDataService.RemoveGamesFromPlaylist(request, userId);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> ReorderPlaylistGames([FromBody] ReorderPlaylistGamesRequest request)
        {
            var userId = userContextHelper.GetUserId();

            try
            {
                await playlistControllerDataService.ReorderPlaylistGames(request, userId);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> TogglePlaylistLike([FromRoute] string playlistId)
        {
            var userId = userContextHelper.GetUserId();
            try
            {
                await playlistControllerDataService.TogglePlaylistLike(playlistId, userId);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
