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
            var user = await context.Users.FindAsync(userId);

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

            var playlistEntities = await context.UserPlaylists
                .Where(x => x.UserIdOwner == userId)
                .Include(x => x.PlaylistGames)
                .OrderBy(x => x.PlaylistName)
                .ToArrayAsync();

            var libraryPlaylists = playlistEntities.Select(pl => new LibraryPlaylist
            {
                PlaylistId = pl.Id,
                Name = pl.PlaylistName,
                GameIds = pl.PlaylistGames.OrderBy(g => g.OrderIndex).Select(g => g.GameId).ToArray()
            }).ToArray();

            return new GetUserLibraryDataResponse
            {
                Consoles = consoles,
                TrackedGames = trackedGames,
                Playlists = libraryPlaylists,
                RaUsername = user!.RAUsername,
                ProfileImageUrl = $"https://media.retroachievements.org/UserPic/{user.RAUsername}.png",
                HardcorePoints = user.UserPointsHardcore,
                AchievementsEarnedHardcore = progress.Sum(p => p.AchievementsGainedHardcore)
            };
        }

        public async Task<ValidateGameHashesResponse> ValidateGameHashes(string[] hashes)
        {
            var matchingHashes = await context.GameHashes
                .Where(gh => hashes.Contains(gh.Md5))
                .Select(gh => new HashMatch
                {
                    Md5 = gh.Md5,
                    GameId = gh.GameId,
                    Title = gh.Game.Title,
                    ConsoleId = gh.Game.ConsoleId,
                    ConsoleName = gh.Game.GameConsole.ConsoleName,
                    ImageIcon = gh.Game.ImageIcon,
                    ImageBoxArt = gh.Game.ImageBoxArt
                })
                .ToArrayAsync();

            return new ValidateGameHashesResponse { Matches = matchingHashes };
        }
    }
}
