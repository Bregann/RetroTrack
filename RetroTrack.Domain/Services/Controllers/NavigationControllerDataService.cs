using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Controllers.Navigation.Responses;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class NavigationControllerDataService(AppDbContext context) : INavigationControllerDataService
    {
        public async Task<GetPublicNavigationDataResponse[]> GetPublicNavigationData()
        {
            return await context.GameConsoles
                .Where(x => x.DisplayOnSite)
                .Select(x => new GetPublicNavigationDataResponse
                {
                    ConsoleId = x.ConsoleId,
                    ConsoleName = x.ConsoleName,
                    ConsoleType = x.ConsoleType,
                    GameCount = x.GameCount
                })
                .OrderBy(x => x.ConsoleName)
                .ToArrayAsync();
        }

        public async Task<GetLoggedInNavigationDataResponse> GetLoggedInNavigationData(int userId)
        {
            var trackedGameCount = await context.TrackedGames.CountAsync(x => x.UserId == userId);
            var inProgressGameCount = await context.UserGameProgress.CountAsync(x => x.UserId == userId);

            var query = from gc in context.GameConsoles.Where(x => x.DisplayOnSite)
                        join ugp in context.UserGameProgress.Where(x => x.UserId == userId)
                            on gc.ConsoleId equals ugp.ConsoleId into grouping
                        select new ConsoleProgressData
                        {
                            ConsoleId = gc.ConsoleId,
                            ConsoleName = gc.ConsoleName,
                            ConsoleType = gc.ConsoleType,
                            TotalGamesInConsole = gc.GameCount,
                            GamesBeatenHardcore = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.BeatenHardcore),
                            GamesBeatenSoftcore = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.BeatenSoftcore),
                            GamesMastered = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Mastered),
                            GamesCompleted = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Completed),
                            PercentageBeatenSoftcore = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind != HighestAwardKind.BeatenSoftcore) / gc.GameCount * 100, 2) : 0,
                            PercentageBeatenHardcore = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind != HighestAwardKind.BeatenHardcore) / gc.GameCount * 100, 2) : 0,
                            PercentageCompleted = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Completed) / gc.GameCount * 100, 2) : 0,
                            PercentageMastered = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Mastered) / gc.GameCount * 100, 2) : 0
                        };

            var user = await context.Users.FirstAsync(x => x.Id == userId);

            var consoleProgressData = await query.ToArrayAsync();

            return new GetLoggedInNavigationDataResponse
            {
                RAName = user.RAUsername,
                RAUserProfileUrl = user.UserProfileUrl,
                UserPoints = user.UserPoints,
                GamesBeatenHardcore = consoleProgressData.Sum(x => x.GamesBeatenHardcore),
                GamesBeatenSoftcore = consoleProgressData.Sum(x => x.GamesBeatenSoftcore),
                GamesCompleted = consoleProgressData.Sum(x => x.GamesCompleted),
                GamesMastered = consoleProgressData.Sum(x => x.GamesMastered),
                TrackedGamesCount = trackedGameCount,
                InProgressGamesCount = inProgressGameCount,
                ConsoleProgressData = consoleProgressData
            };
        }
    }
}
