using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Controllers.Navigation;
using RetroTrack.Domain.DTOs.Helpers;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class NavigationControllerDataService(AppDbContext context) : INavigationControllerDataService
    {
        public async Task<GetPublicNavigationDataDto[]> GetPublicNavigationData()
        {
            return await context.GameConsoles
                .Where(x => x.DisplayOnSite)
                .Select(x => new GetPublicNavigationDataDto
                {
                    ConsoleId = x.ConsoleId,
                    ConsoleName = x.ConsoleName,
                    ConsoleType = x.ConsoleType,
                    GameCount = x.GameCount
                })
                .OrderBy(x => x.ConsoleName)
                .ToArrayAsync();
        }

        public async Task<GetLoggedInNavigationDataDto> GetLoggedInNavigationData(UserDataDto userData)
        {
            var trackedGameCount = await context.TrackedGames.CountAsync(x => x.UserId == userData.UserId);
            var inProgressGameCount = await context.UserGameProgress.CountAsync(x => x.UserId == userData.UserId);

            var query = from gc in context.GameConsoles.Where(x => x.DisplayOnSite)
                        join ugp in context.UserGameProgress.Where(x => x.UserId.Equals(userData.UserId))
                            on gc.ConsoleId equals ugp.ConsoleId into grouping
                        select new ConsoleProgressData
                        {
                            ConsoleId = gc.ConsoleId,
                            ConsoleName = gc.ConsoleName,
                            ConsoleType = gc.ConsoleType,
                            TotalGamesInConsole = gc.GameCount,
                            GamesBeaten = grouping.Count(x => x.HighestAwardKind != null),
                            GamesMastered = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Mastered || x.HighestAwardKind == HighestAwardKind.Completed),
                            PercentageBeaten = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind != null) / gc.GameCount * 100, 2) : 0,
                            PercentageMastered = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Mastered || x.HighestAwardKind == HighestAwardKind.Completed) / gc.GameCount * 100, 2) : 0
                        };

            var user = await context.Users.FirstAsync(x => x.Id == userData.UserId);

            var consoleProgressData = await query.ToArrayAsync();

            return new GetLoggedInNavigationDataDto
            {
                RAName = user.RAUsername,
                RAUserProfileUrl = "https://media.retroachievements.org" + user.UserProfileUrl,
                UserPoints = user.UserPoints,
                GamesBeaten = consoleProgressData.Sum(x => x.GamesBeaten),
                GamesMastered = consoleProgressData.Sum(x => x.GamesMastered),
                TrackedGamesCount = trackedGameCount,
                InProgressGamesCount = inProgressGameCount,
                ConsoleProgressData = consoleProgressData
            };
        }
    }
}
