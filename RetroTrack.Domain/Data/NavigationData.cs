using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Dtos.Navigation;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Enums;

namespace RetroTrack.Domain.Data
{
    public class NavigationData
    {
        public static async Task<GetPublicNavigationDataDto[]> GetPublicNavigationData()
        {
            using (var context = new DatabaseContext())
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

        public static async Task<GetLoggedInNavigationDataDto> GetLoggedInNavigationData(string username)
        {
            using (var context = new DatabaseContext())
            {
                var trackedGameCount = await context.TrackedGames.CountAsync(x => x.User.Username == username);
                var inProgressGameCount = await context.UserGameProgress.CountAsync(x => x.Username == username);

                var query = from gc in context.GameConsoles.Where(x => x.DisplayOnSite)
                           join ugp in context.UserGameProgress.Where(x => x.Username.Equals(username))
                               on gc.ConsoleID equals ugp.ConsoleId into grouping
                           select new ConsoleProgressData
                           {
                               ConsoleId = gc.ConsoleID,
                               ConsoleName = gc.ConsoleName,
                               ConsoleType = gc.ConsoleType,
                               TotalGamesInConsole = gc.GameCount,
                               GamesBeaten = grouping.Count(x => x.HighestAwardKind != null),
                               GamesMastered = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Mastered || x.HighestAwardKind == HighestAwardKind.Completed),
                               PercentageBeaten = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind != null) / gc.GameCount * 100, 2) : 0,
                               PercentageMastered = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Mastered || x.HighestAwardKind == HighestAwardKind.Completed) / gc.GameCount * 100, 2) : 0
                           };

                var user = await context.Users.FirstAsync(x => x.Username == username);

                var consoleProgressData = await query.ToArrayAsync();

                return new GetLoggedInNavigationDataDto
                {
                    RAName = user.RAUsername,
                    RAUserProfileUrl = "https://media.retroachievements.org" + user.UserProfileUrl,
                    UserPoints = user.UserPoints,
                    UserRank = user.UserRank,
                    GamesBeaten = consoleProgressData.Sum(x => x.GamesBeaten),
                    GamesMastered = consoleProgressData.Sum(x => x.GamesMastered),
                    TrackedGamesCount = trackedGameCount,
                    InProgressGamesCount = inProgressGameCount,
                    ConsoleProgressData = consoleProgressData
                };
            }
        }
    }
}