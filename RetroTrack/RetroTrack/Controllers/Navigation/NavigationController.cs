using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos.Navigation;

namespace RetroTrack.Api.Controllers.Navigation
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class NavigationController : ControllerBase
    {
        [HttpGet]
        public async Task<GetPublicNavigationDataDto[]> GetPublicNavigationData()
        {
            return await NavigationData.GetPublicNavigationData();
        }
    }
}