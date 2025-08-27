using RetroTrack.Domain.DTOs.Controllers.Sitemap;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ISitemapDataService
    {
        Task<int[]> GetConsoleIds();
        Task<GetGameIdsResponse[]> GetGameIds();
    }
}
