using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Users.Responses;
using RetroTrack.Domain.Exceptions;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;
using Serilog;

namespace RetroTrack.Api.Controllers.Users
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class UsersController(IUsersControllerDataService usersControllerData, IUserContextHelper userContextHelper) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<RequestUserGameUpdateResponse>> UpdateUserGames()
        {
            var user = userContextHelper.GetUserId();

            return await usersControllerData.RequestUserGameUpdate(user);
        }

        [HttpGet]
        public async Task<ActionResult<bool>> CheckUserUpdateProcessingState()
        {
            var user = userContextHelper.GetUserId();

            return await usersControllerData.CheckUserUpdateCompleted(user);
        }

        [HttpGet("{username}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetUserProfileResponse>> GetUserProfile([FromRoute] string username)
        {
            try
            {
                return await usersControllerData.GetUserProfile(username.ToLower());
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { ex.Message });
            }
            catch (RetroAchievementsApiException ex)
            {
                return BadRequest(new { ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { ex.Message });
            }
            catch (Exception ex)
            {
                Log.Error(ex, $"An error occurred while getting user profile for ${username}");
                return StatusCode(500, new { Message = "An unknown error has occurred" });
            }
        }
    }
}