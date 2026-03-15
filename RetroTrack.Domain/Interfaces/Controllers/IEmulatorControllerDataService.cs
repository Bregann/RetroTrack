using RetroTrack.Domain.DTOs.Controllers.Emulators.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IEmulatorControllerDataService
    {
        Task<GetEmulatorConfigResponse> GetEmulatorConfig();
    }
}
