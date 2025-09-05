using RetroTrack.Domain.DTOs.Controllers.Search.Requests;
using RetroTrack.Domain.DTOs.Controllers.Search.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ISearchControllerDataService
    {
        Task<DoSearchResponse> DoSearch(DoSearchRequest request);
        Task<GetSearchConsolesResponse> GetSearchConsoles();
    }
}
