using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Navigation.Responses;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class NavigationController(INavigationControllerDataService navigationControllerData, IUserContextHelper userContextHelper) : ControllerBase
    {
        [HttpGet]
        public async Task<GetPublicNavigationDataResponse[]> GetPublicNavigationData()
        {
            return await navigationControllerData.GetPublicNavigationData();
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<GetLoggedInNavigationDataResponse>> GetLoggedInNavigationData()
        {
            var user = userContextHelper.GetUserId();
            return Ok(await navigationControllerData.GetLoggedInNavigationData(user));
        }
    }
}
