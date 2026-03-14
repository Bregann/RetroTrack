using RetroTrack.Domain.DTOs.Controllers.Library.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ILibraryControllerDataService
    {
        Task<GetUserLibraryDataResponse> GetUserLibraryData(int userId);
    }
}
