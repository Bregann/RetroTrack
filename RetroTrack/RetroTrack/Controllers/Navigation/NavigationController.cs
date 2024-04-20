using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Helpers;

namespace RetroTrack.Api.Controllers.Navigation
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class NavigationController : ControllerBase
    {
        [HttpPost]
        public async Task GetPublicNavigationData()
        {

        }
    }
}