using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.OldCode.Data;
using RetroTrack.Domain.OldCode.Dtos;
using RetroTrack.Domain.OldCode.Helpers;

namespace RetroTrack.Api.Controllers.Users
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpPost]
        public ActionResult<UpdateUserGamesDto> UpdateUserGames()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            return UserData.UpdateUserGames(user);
        }

        [HttpGet]
        public ActionResult<bool> CheckUserUpdateProcessingState()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            return UserData.CheckUserUpdateCompleted(user);
        }
    }
}