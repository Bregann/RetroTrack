using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data.LoggedIn.UserData;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet("UpdateUserGames")]
        public async Task<ActionResult<UpdateUserGamesDto>> UpdateUserGames()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return BadRequest();
            }

            return await UserData.UpdateUserGames(user);
        }
    }
}
