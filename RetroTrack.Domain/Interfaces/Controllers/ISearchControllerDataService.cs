using RetroTrack.Domain.DTOs.Controllers.Search.Requests;
using RetroTrack.Domain.DTOs.Controllers.Search.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ISearchControllerDataService
    {
        Task<DoSearchResponse> DoSearch(DoSearchRequest request);
        Task<GetSearchConsolesResponse> GetSearchConsoles();
    }
}
