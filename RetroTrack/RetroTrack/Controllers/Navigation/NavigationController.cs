using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data.Public.Navigation;
using RetroTrack.Domain.Dtos.LoggedIn.Navigation;

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
    }
}
