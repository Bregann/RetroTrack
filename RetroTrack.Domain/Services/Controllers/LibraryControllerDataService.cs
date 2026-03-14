using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Controllers.Library.Responses;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class LibraryControllerDataService(AppDbContext context) : ILibraryControllerDataService
    {
        public async Task<GetUserLibraryDataResponse> GetUserLibraryData(int userId)
        {
            var consoles = await context.GameConsoles
                .Where(x => x.DisplayOnSite)
                .OrderBy(x => x.ConsoleName)
                .Select(x => new LibraryConsole
                {
                    ConsoleId = x.ConsoleId,
                    ConsoleName = x.ConsoleName,
                    ConsoleType = x.ConsoleType
                })
                .ToArrayAsync();

            var trackedGamesList = await context.TrackedGames
                .Where(x => x.UserId == userId)
                .ToArrayAsync();

            var progress = await context.UserGameProgress
                .Where(x => x.UserId == userId)
                .ToArrayAsync();

            var progressByGameId = progress.ToDictionary(p => p.GameId);

            var trackedGames = trackedGamesList.Select(tg =>
            {
                progressByGameId.TryGetValue(tg.GameId, out var p);
                return new LibraryTrackedGame
                {
                    GameId = tg.Game.Id,
                    Title = tg.Game.Title,
                    ConsoleId = tg.Game.ConsoleId,
                    ConsoleName = tg.Game.GameConsole.ConsoleName,
                    ImageIcon = tg.Game.ImageIcon,
                    ImageBoxArt = tg.Game.ImageBoxArt,
                    AchievementCount = tg.Game.AchievementCount,
                    Points = tg.Game.Points,
                    AchievementsEarned = p?.AchievementsGainedHardcore ?? 0,
                    PercentageComplete = p?.GamePercentageHardcore ?? 0,
                    HighestAward = p?.HighestAwardKind
                };
            }).ToArray();

            return new GetUserLibraryDataResponse
            {
                Consoles = consoles,
                TrackedGames = trackedGames
            };
        }
    }
}
