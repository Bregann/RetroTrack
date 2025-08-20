using RetroTrack.Domain.DTOs.Controllers.Navigation.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface INavigationControllerDataService
    {
        Task<GetLoggedInNavigationDataResponse> GetLoggedInNavigationData(int userId);
        Task<GetPublicNavigationDataResponse[]> GetPublicNavigationData();
    }
}