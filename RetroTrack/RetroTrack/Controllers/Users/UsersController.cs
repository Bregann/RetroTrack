using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;
using System.ComponentModel;

namespace RetroTrack.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet("UpdateUserGames")]
        public ActionResult<UpdateUserGamesDto> UpdateUserGames()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            return UserData.UpdateUserGames(user);
        }

        [HttpGet("CheckUserUpdateProcessingState")]
        public ActionResult<bool> CheckUserUpdateProcessingState()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            return UserData.CheckUserUpdateCompleted(user);
        }
    }
}
