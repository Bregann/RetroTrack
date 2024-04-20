using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Dtos.Navigation;
using RetroTrack.Domain.Helpers;

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