using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Sitemap;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Api.Controllers.Sitemap
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SitemapController(ISitemapDataService sitemapData) : ControllerBase
    {
        [HttpGet]
        public async Task<int[]> GetConsoleIds()
        {
            return await sitemapData.GetConsoleIds();
        }

        [HttpGet]
        public async Task<GetGameIdsResponse[]> GetGameIds()
        {
            return await sitemapData.GetGameIds();
        }
    }
}
