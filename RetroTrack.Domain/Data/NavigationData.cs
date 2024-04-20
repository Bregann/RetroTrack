using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Dtos.Navigation;
using RetroTrack.Infrastructure.Database.Context;

namespace RetroTrack.Domain.Data
{
    public class NavigationData
    {
        public static async Task<GetPublicNavigationDataDto[]> GetPublicNavigationData()
        {
            using(var context = new DatabaseContext())
            {
                return await context.GameConsoles
                    .Where(x => x.DisplayOnSite)
                    .Select(x => new GetPublicNavigationDataDto
                        {
                            ConsoleId = x.ConsoleID,
                            ConsoleName = x.ConsoleName,
                            ConsoleType = x.ConsoleType,
                            GameCount = x.GameCount
                        })
                    .OrderBy(x => x.ConsoleName)
                    .ToArrayAsync();
            }
        }
    }
}