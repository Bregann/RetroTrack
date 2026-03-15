using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Emulators.Responses;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmulatorsController(IEmulatorControllerDataService emulatorControllerData) : ControllerBase
    {
        [HttpGet]
        public async Task<GetEmulatorConfigResponse> GetEmulatorConfig()
        {
            return await emulatorControllerData.GetEmulatorConfig();
        }
    }
}
