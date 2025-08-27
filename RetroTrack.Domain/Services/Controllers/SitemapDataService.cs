using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Controllers.Sitemap;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class SitemapDataService(AppDbContext context) : ISitemapDataService
    {
        public async Task<GetGameIdsResponse[]> GetGameIds()
        {
            return await context.Games
                    .Select(x => new GetGameIdsResponse
                    {
                        Id = x.Id,
                        LastUpdated = x.LastModified
                    })
                    .ToArrayAsync();
        }

        public async Task<int[]> GetConsoleIds()
        {
            return await context.GameConsoles
                .Where(x => x.DisplayOnSite)
                .Select(x => x.ConsoleId)
                .ToArrayAsync();
        }
    }
}
