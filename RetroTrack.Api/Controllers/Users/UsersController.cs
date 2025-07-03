using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Users.Responses;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

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
            return await usersControllerData.GetUserProfile(username.ToLower());
        }
    }
}