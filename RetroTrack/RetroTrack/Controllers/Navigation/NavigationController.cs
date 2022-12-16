using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Api.Controllers.Navigation
{
    [Route("api/[controller]")]
    [ApiController]
    public class NavigationController : ControllerBase
    {
        [HttpGet("GetLoggedOutUserGameCounts")]
        public NavigationGameCountsDto GetLoggedOutUserGameCounts()
        {
            return NavigationData.GetGameCounts();
        }

        [HttpGet("GetLoggedInUserGameCounts")]
        public ActionResult<LoggedInNavigationGameCountsDto> GetLoggedInUserGameCounts()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            return NavigationData.GetGameCountsLoggedIn(user);
        }

        [HttpGet("GetUserNavProfile")]
        public ActionResult<UserNavProfileDto> GetUserNavProfile()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized();
            }

            var userProfile = NavigationData.GetUserNavProfileData(user);

            if (userProfile == null)
            {
                return BadRequest();
            }

            return userProfile;
        }
    }
}