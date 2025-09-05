using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Search.Requests;
using RetroTrack.Domain.DTOs.Controllers.Search.Responses;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SearchController(ISearchControllerDataService searchControllerDataService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<DoSearchResponse>> DoSearch([FromQuery] DoSearchRequest request)
        {
            try
            {
                return await searchControllerDataService.DoSearch(request);
            }
            catch (ArgumentException)
            {
                return BadRequest("Invalid search term");
            }
        }

        [HttpGet]
        public async Task<GetSearchConsolesResponse> GetSearchConsoles()
        {
            return await searchControllerDataService.GetSearchConsoles();
        }
    }
}
