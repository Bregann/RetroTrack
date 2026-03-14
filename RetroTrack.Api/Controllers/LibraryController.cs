using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Library.Requests;
using RetroTrack.Domain.DTOs.Controllers.Library.Responses;
using RetroTrack.Domain.Interfaces.Controllers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class LibraryController(ILibraryControllerDataService libraryControllerData, IUserContextHelper userContextHelper) : ControllerBase
    {
        [HttpGet]
        public async Task<GetUserLibraryDataResponse> GetUserLibraryData()
        {
            var userId = userContextHelper.GetUserId();
            return await libraryControllerData.GetUserLibraryData(userId);
        }

        [HttpPost]
        public async Task<ValidateGameHashesResponse> ValidateGameHashes([FromBody] ValidateGameHashesRequest request)
        {
            return await libraryControllerData.ValidateGameHashes(request.Hashes);
        }
    }
}
