using RetroTrack.Domain.DTOs.Controllers.Navigation;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface INavigationControllerDataService
    {
        Task<GetLoggedInNavigationDataDto> GetLoggedInNavigationData(string username);
        Task<GetPublicNavigationDataDto[]> GetPublicNavigationData();
    }
}
