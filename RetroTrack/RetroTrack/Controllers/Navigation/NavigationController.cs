using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Navigation;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers.Navigation
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class NavigationController(INavigationControllerDataService navigationControllerData, IAuthHelperService authHelperService) : ControllerBase
    {
        [HttpGet]
        public async Task<GetPublicNavigationDataDto[]> GetPublicNavigationData()
        {
            return await navigationControllerData.GetPublicNavigationData();
        }

        [HttpGet]
        public async Task<ActionResult<GetLoggedInNavigationDataDto>> GetLoggedInNavigationData()
        {
            var user = authHelperService.ValidateSessionIdAndReturnUsername(Request.Headers);

            if (user == null)
            {
                return Unauthorized(false);
            }

            return Ok(await navigationControllerData.GetLoggedInNavigationData(user));
        }
    }
}