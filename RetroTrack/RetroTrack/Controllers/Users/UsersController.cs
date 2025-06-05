using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Users;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers.Users
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController(IUsersControllerDataService usersControllerData, IAuthHelperService authHelper) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<UpdateUserGamesDto>> UpdateUserGames()
        {
            var user = authHelper.ValidateSessionIdAndReturnUserData(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            return await usersControllerData.UpdateUserGames(user);
        }

        [HttpGet]
        public async Task<ActionResult<bool>> CheckUserUpdateProcessingState()
        {
            var user = authHelper.ValidateSessionIdAndReturnUserData(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            return await usersControllerData.CheckUserUpdateCompleted(user);
        }
    }
}