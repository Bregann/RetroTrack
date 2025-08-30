using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Playlists.Requests;
using RetroTrack.Domain.DTOs.Controllers.Playlists.Responses;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class PlaylistControllerDataService(AppDbContext context) : IPlaylistControllerDataService
    {
        public async Task<GetPlaylistResponse> GetPublicPlaylists(GetPlaylistRequest request)
        {
            var query = context.UserPlaylists
                .Where(p => p.IsPublic);

            return await DoFilter(request, query);
        }

        public async Task<GetPlaylistResponse> GetUserPlaylists(int userId, GetPlaylistRequest request)
        {
            var query = context.UserPlaylists
                .Where(p => p.UserIdOwner == userId);

            return await DoFilter(request, query);
        }

        public async Task<GetPlaylistResponse> GetUserLikedPlaylists(int userId, GetPlaylistRequest request)
        {
            var query = context.UserPlaylists
                .Where(p => p.PlaylistLikes.Any(l => l.UserId == userId) && p.UserIdOwner != userId);

            return await DoFilter(request, query);
        }

        public async Task<string> AddNewPlaylist(int userId, string playlistName, string? description, bool isPublic)
        {
            var newPlaylist = new UserPlaylist
            {
                PlaylistName = playlistName,
                Description = description,
                IsPublic = isPublic,
                UserIdOwner = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await context.UserPlaylists.AddAsync(newPlaylist);
            await context.SaveChangesAsync();

            return newPlaylist.Id;
        }

        public async Task<GetPublicPlaylistDataResponse> GetPublicPlaylistData(GetPublicPlaylistDataRequest request)
        {
            var playlist = await context.UserPlaylists.FirstOrDefaultAsync(p => p.Id == request.PlaylistId && p.IsPublic);

            if (playlist == null)
            {
                throw new KeyNotFoundException("Playlist not found");
            }

            var games = playlist.PlaylistGames
                .Where(pg => pg.UserPlaylistId == playlist.Id)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.Trim().ToLower();
                games = games.Where(pg => pg.Game.Title.ToLower().Contains(searchTerm));
            }

            if (request.SortByIndex == true)
            {
                games = games.OrderBy(pg => pg.OrderIndex);
            }
            else if (request.SortByGameTitle == true)
            {
                games = games.OrderBy(pg => pg.Game.Title);
            }
            else if (request.SortByConsoleName == true)
            {
                games = games.OrderBy(pg => pg.Game.GameConsole.ConsoleName);
            }
            else if (request.SortByGenre == true)
            {
                games = games.OrderBy(pg => pg.Game.GameGenre);
            }
            else if (request.SortByAchievementCount == true)
            {
                games = games.OrderByDescending(pg => pg.Game.Achievements.Count);
            }
            else if (request.SortByPoints == true)
            {
                games = games.OrderByDescending(pg => pg.Game.Achievements.Sum(a => a.Points));
            }
            else
            {
                games = games.OrderBy(pg => pg.OrderIndex);
            }

            return new GetPublicPlaylistDataResponse
            {
                Id = playlist.Id,
                Name = playlist.PlaylistName,
                Description = playlist.Description ?? string.Empty,
                NumberOfLikes = playlist.PlaylistLikes.Count,
                NumberOfGames = playlist.PlaylistGames.Count,
                NumberOfConsoles = playlist.PlaylistGames.Select(pg => pg.Game.ConsoleId).Distinct().Count(),
                CreatedAt = playlist.CreatedAt,
                UpdatedAt = playlist.UpdatedAt,
                CreatedBy = playlist.UserOwner.RAUsername,
                Icons = playlist.PlaylistGames
                    .OrderBy(pg => pg.OrderIndex)
                    .Take(4)
                    .Select(pg => pg.Game.ImageIcon ?? string.Empty)
                    .Where(url => !string.IsNullOrEmpty(url))
                    .ToArray(),
                Games = await games.Select(x => new PlaylistGameItem
                {
                    OrderIndex = x.OrderIndex,
                    GameId = x.GameId,
                    Title = x.Game.Title,
                    ConsoleName = x.Game.GameConsole.ConsoleName,
                    GameIconUrl = x.Game.ImageIcon ?? string.Empty,
                    Genre = x.Game.GameGenre ?? string.Empty,
                    AchievementCount = x.Game.Achievements.Count,
                    Points = x.Game.Achievements.Sum(a => a.Points),
                    Players = x.Game.Players ?? 0
                }).ToArrayAsync(),
                TotalPointsToEarn = playlist.PlaylistGames.Sum(pg => pg.Game.Achievements.Sum(a => a.Points)),
                TotalAchievementsToEarn = playlist.PlaylistGames.Sum(pg => pg.Game.Achievements.Count)
            };
        }

        public async Task<GetLoggedInPlaylistDataResponse> GetLoggedInPlaylistData(int userId, GetLoggedInPlaylistDataRequest request)
        {
            var playlist = await context.UserPlaylists.FirstOrDefaultAsync(p => p.Id == request.PlaylistId && (p.IsPublic || p.UserIdOwner == userId));
            if (playlist == null)
            {
                throw new KeyNotFoundException("Playlist not found");
            }
            var games = playlist.PlaylistGames
                .Where(pg => pg.UserPlaylistId == playlist.Id)
                .AsQueryable();
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.Trim().ToLower();
                games = games.Where(pg => pg.Game.Title.ToLower().Contains(searchTerm));
            }
            if (request.SortByIndex == true)
            {
                games = games.OrderBy(pg => pg.OrderIndex);
            }
            else if (request.SortByGameTitle == true)
            {
                games = games.OrderBy(pg => pg.Game.Title);
            }
            else if (request.SortByConsoleName == true)
            {
                games = games.OrderBy(pg => pg.Game.GameConsole.ConsoleName);
            }
            else if (request.SortByGenre == true)
            {
                games = games.OrderBy(pg => pg.Game.GameGenre);
            }
            else if (request.SortByAchievementCount == true)
            {
                games = games.OrderByDescending(pg => pg.Game.Achievements.Count);
            }
            else if (request.SortByPoints == true)
            {
                games = games.OrderByDescending(pg => pg.Game.Achievements.Sum(a => a.Points));
            }
            else
            {
                games = games.OrderBy(pg => pg.OrderIndex);
            }

            var userGameProgress = await context.UserGameProgress
                .Where(ugp => ugp.UserId == userId && games.Any(pg => pg.GameId == ugp.GameId))
                .ToListAsync();

            var gameItems = await games.Select(x => new LoggedInGameItem
            {
                OrderIndex = x.OrderIndex,
                GameId = x.GameId,
                Title = x.Game.Title,
                ConsoleName = x.Game.GameConsole.ConsoleName,
                GameIconUrl = x.Game.ImageIcon ?? string.Empty,
                Genre = x.Game.GameGenre ?? string.Empty,
                AchievementCount = x.Game.Achievements.Count,
                Points = x.Game.Achievements.Sum(a => a.Points),
                Players = x.Game.Players ?? 0,
                HighestAward = Enums.HighestAwardKind.Unknown,
                AchievementsEarnedSoftcore = 0,
                AchievementsEarnedHardcore = 0
            })
            .ToArrayAsync();

            foreach (var item in gameItems)
            {
                var ugp = userGameProgress.FirstOrDefault(ugp => ugp.GameId == item.GameId);

                if (ugp != null)
                {
                    item.HighestAward = ugp.HighestAwardKind;
                    item.AchievementsEarnedHardcore = ugp.AchievementsGainedHardcore;
                    item.AchievementsEarnedSoftcore = ugp.AchievementsGained;
                }
            }

            return new GetLoggedInPlaylistDataResponse
            {
                Id = playlist.Id,
                Name = playlist.PlaylistName,
                Description = playlist.Description ?? string.Empty,
                NumberOfLikes = playlist.PlaylistLikes.Count,
                NumberOfGames = playlist.PlaylistGames.Count,
                NumberOfConsoles = playlist.PlaylistGames.Select(pg => pg.Game.ConsoleId).Distinct().Count(),
                CreatedAt = playlist.CreatedAt,
                UpdatedAt = playlist.UpdatedAt,
                CreatedBy = playlist.UserOwner.RAUsername,
                Icons = playlist.PlaylistGames
                    .OrderBy(pg => pg.OrderIndex)
                    .Take(4)
                    .Select(pg => pg.Game.ImageIcon ?? string.Empty)
                    .ToArray(),
                Games = gameItems,
                TotalAchievementsEarnedHardcore = userGameProgress.Sum(ugp => ugp.AchievementsGainedHardcore),
                TotalAchievementsEarnedSoftcore = userGameProgress.Sum(ugp => ugp.AchievementsGained),
                TotalAchievementsToEarn = playlist.PlaylistGames.Sum(pg => pg.Game.Achievements.Count),
                TotalGamesBeatenHardcore = userGameProgress.Count(ugp => ugp.HighestAwardKind == Enums.HighestAwardKind.BeatenHardcore || ugp.HighestAwardKind == Enums.HighestAwardKind.Mastered),
                TotalGamesBeatenSoftcore = userGameProgress.Count(ugp => ugp.HighestAwardKind == Enums.HighestAwardKind.BeatenSoftcore),
                TotalGamesCompletedSoftcore = userGameProgress.Count(ugp => ugp.HighestAwardKind == Enums.HighestAwardKind.Completed),
                TotalGamesMasteredHardcore = userGameProgress.Count(ugp => ugp.HighestAwardKind == Enums.HighestAwardKind.Mastered),
                TotalPointsToEarn = playlist.PlaylistGames.Sum(pg => pg.Game.Achievements.Sum(a => a.Points))
            };
        }

        public async Task AddGameToPlaylist(string playlistId, int gameId, int userId)
        {
            var playlist = await context.UserPlaylists.FirstOrDefaultAsync(p => p.Id == playlistId && p.UserIdOwner == userId);

            if (playlist == null)
            {
                throw new KeyNotFoundException("Playlist not found");
            }

            if (playlist.PlaylistGames.Any(pg => pg.GameId == gameId))
            {
                throw new InvalidOperationException("Game already in playlist");
            }

            var newPlaylistGame = new UserPlaylistGame
            {
                UserPlaylistId = playlistId,
                GameId = gameId,
                OrderIndex = playlist.PlaylistGames.Count + 1
            };

            await context.UserPlaylistGames.AddAsync(newPlaylistGame);
            await context.SaveChangesAsync();
        }

        private static async Task<GetPlaylistResponse> DoFilter(GetPlaylistRequest request, IQueryable<UserPlaylist> query)
        {
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.Trim().ToLower();
                query = query.Where(p => p.PlaylistName.ToLower().Contains(searchTerm) || (p.Description != null && p.Description.ToLower().Contains(searchTerm)));
            }

            if (request.SortByNewest == true)
            {
                query = query.OrderByDescending(p => p.CreatedAt);
            }
            else if (request.SortByOldest == true)
            {
                query = query.OrderBy(p => p.CreatedAt);
            }
            else if (request.SortByMostLiked == true)
            {
                query = query.OrderByDescending(p => p.PlaylistLikes.Count);
            }
            else if (request.SortByAtoZ == true)
            {
                query = query.OrderBy(p => p.PlaylistName);
            }
            else
            {
                query = query.OrderByDescending(p => p.CreatedAt);
            }

            var playlists = await query
                .Select(p => new PlaylistItem
                {
                    Id = p.Id.ToString(),
                    Name = p.PlaylistName,
                    Description = p.Description ?? string.Empty,
                    NumberOfLikes = p.PlaylistLikes.Count,
                    NumberOfGames = p.PlaylistGames.Count,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    CreatedBy = p.UserOwner.RAUsername,
                    Icons = p.PlaylistGames
                        .OrderBy(pg => pg.OrderIndex)
                        .Take(4)
                        .Select(pg => pg.Game.ImageIcon ?? string.Empty)
                        .Where(url => !string.IsNullOrEmpty(url))
                        .ToArray(),
                    IsPublic = p.IsPublic
                })
                .ToArrayAsync();

            return new GetPlaylistResponse
            {
                Playlists = playlists
            };
        }
    }
}
