using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data.Public.Navigation;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Controllers.Navigation
{
    [Route("api/[controller]")]
    [ApiController]
    public class NavigationController : ControllerBase
    {
        [HttpGet("GetLoggedOutUserGameCounts")]
        public NavigationGameCountsDto GetLoggedOutUserGameCounts()
        {
            return Domain.Data.Public.Navigation.Navigation.GetGameCounts();
        }

        [HttpGet("GetLoggedInUserGameCounts")]
        public ActionResult<LoggedInNavigationGameCountsDto> GetLoggedInUserGameCounts()
        {
            var user = AuthHelper.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return BadRequest();
            }

            return Domain.Data.Public.Navigation.Navigation.GetGameCountsLoggedIn(user);
        }
    }
}
