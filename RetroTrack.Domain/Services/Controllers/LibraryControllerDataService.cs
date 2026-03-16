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

            var trackedGameIds = (await context.TrackedGames
                .Where(x => x.UserId == userId)
                .Select(x => x.GameId)
                .ToArrayAsync())
                .ToHashSet();

            var progress = await context.UserGameProgress
                .Where(x => x.UserId == userId)
                .ToArrayAsync();

            var progressByGameId = progress.ToDictionary(p => p.GameId);

            var activity = await context.UserGameActivities
                .Where(x => x.UserId == userId)
                .ToArrayAsync();

            var activityByGameId = activity.ToDictionary(a => a.GameId);

            // Include all games the user has progress on, plus any tracked games without progress
            var allGameIds = trackedGameIds
                .Union(progressByGameId.Keys)
                .ToHashSet();

            var games = await context.Games
                .Where(g => allGameIds.Contains(g.Id))
                .Include(g => g.GameConsole)
                .ToArrayAsync();

            var trackedGames = games.Select(game =>
            {
                progressByGameId.TryGetValue(game.Id, out var p);
                activityByGameId.TryGetValue(game.Id, out var act);
                return new LibraryTrackedGame
                {
                    GameId = game.Id,
                    Title = game.Title,
                    ConsoleId = game.ConsoleId,
                    ConsoleName = game.GameConsole.ConsoleName,
                    ImageIcon = game.ImageIcon,
                    ImageBoxArt = game.ImageBoxArt,
                    AchievementCount = game.AchievementCount,
                    Points = game.Points,
                    AchievementsEarned = p?.AchievementsGainedHardcore ?? 0,
                    PercentageComplete = p?.GamePercentageHardcore ?? 0,
                    HighestAward = p?.HighestAwardKind,
                    LastPlayedUtc = act?.LastPlayedUtc,
                    IsTracked = trackedGameIds.Contains(game.Id)
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
                .Where(gh => hashes.Contains(gh.Md5.ToLower()) && gh.Game.HasAchievements)
                .Select(gh => new HashMatch
                {
                    Md5 = gh.Md5.ToLower(),
                    GameId = gh.GameId,
                    Title = gh.Game.Title,
                    ConsoleId = gh.Game.ConsoleId,
                    ConsoleName = gh.Game.GameConsole.ConsoleName,
                    ImageIcon = gh.Game.ImageIcon,
                    ImageBoxArt = gh.Game.ImageBoxArt,
                    AchievementCount = gh.Game.AchievementCount,
                    Points = gh.Game.Points
                })
                .ToArrayAsync();

            return new ValidateGameHashesResponse { Matches = matchingHashes };
        }
    }
}
