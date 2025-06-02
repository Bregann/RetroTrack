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
        public ActionResult<UpdateUserGamesDto> UpdateUserGames()
        {
            var user = authHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            return usersControllerData.UpdateUserGames(user);
        }

        [HttpGet]
        public ActionResult<bool> CheckUserUpdateProcessingState()
        {
            var user = authHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            return usersControllerData.CheckUserUpdateCompleted(user);
        }
    }
}