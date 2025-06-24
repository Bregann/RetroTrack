using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Games.Responses;
using RetroTrack.Domain.DTOs.Controllers.TrackedGames.Requests;
using RetroTrack.Domain.DTOs.Controllers.TrackedGames.Responses;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class TrackedGamesControllerDataService(AppDbContext context) : ITrackedGamesControllerDataService
    {
        public async Task AddNewTrackedGame(int userId, int gameId)
        {
            var user = await context.Users.Where(x => x.Id == userId).FirstAsync();

            if (await context.TrackedGames.AnyAsync(x => x.GameId == gameId && x.User == user))
            {
                throw new InvalidOperationException("Game is already tracked by this user.");
            }

            await context.TrackedGames.AddAsync(new TrackedGame
            {
                GameId = gameId,
                UserId = user.Id
            });

            await context.SaveChangesAsync();
        }

        public async Task RemoveTrackedGame(int userId, int gameId)
        {
            var rowsRemoved = await context.TrackedGames.Where(x => x.GameId == gameId && x.UserId == userId).ExecuteDeleteAsync();

            if (rowsRemoved == 0)
            {
                throw new KeyNotFoundException("Game is not tracked by this user.");
            }
        }

        public async Task<GetUserTrackedGamesResponse> GetTrackedGamesForUser(int userId, GetUserTrackedGamesRequest request)
        {
            var gameQuery = from tg in context.TrackedGames
                            where tg.UserId == userId
                            join upg in context.UserGameProgress
                                on tg.GameId equals upg.GameId
                                into upgGroup
                            from upg in upgGroup.DefaultIfEmpty()
                            select new
                            {
                                Game = tg.Game,
                                User = tg.User,
                                GamePercentage = upg != null ? (double)upg.AchievementsGained / tg.Game.AchievementCount * 100 : 0,
                                AchievementsUnlocked = upg != null ? upg.AchievementsGained : 0,
                                HighestAward = upg != null ? upg.HighestAwardKind : null
                            };

            if (request.SearchTerm != null && request.SearchType != null)
            {
                switch (request.SearchType)
                {
                    case ConsoleTableSearchType.GameTitle:
                        gameQuery = gameQuery.Where(x => x.Game.Title.ToLower().Contains(request.SearchTerm.ToLower()));
                        break;
                    case ConsoleTableSearchType.GameGenre:
                        gameQuery = gameQuery.Where(x => x.Game.GameGenre != null && x.Game.GameGenre.ToLower().Contains(request.SearchTerm.ToLower()));
                        break;
                    case ConsoleTableSearchType.AchievementName:
                        gameQuery = gameQuery.Where(x => x.Game.Achievements.Any(x => x.AchievementName.ToLower().Contains(request.SearchTerm.ToLower())));
                        break;
                    case ConsoleTableSearchType.AchievementDescription:
                        gameQuery = gameQuery.Where(x => x.Game.Achievements.Any(x => x.AchievementDescription.ToLower().Contains(request.SearchTerm.ToLower())));
                        break;
                }
            }

            if (request.SortByName != null)
            {
                gameQuery = request.SortByName == true
                    ? gameQuery.OrderBy(x => x.Game.Title)
                    : gameQuery.OrderByDescending(x => x.Game.Title);
            }
            else if (request.SortByConsole != null)
            {
                gameQuery = request.SortByConsole == true
                    ? gameQuery.OrderBy(x => x.Game.GameConsole.ConsoleName)
                    : gameQuery.OrderByDescending(x => x.Game.GameConsole.ConsoleName);
            }
            else if (request.SortByPoints != null)
            {
                gameQuery = request.SortByPoints == true
                    ? gameQuery.OrderBy(x => x.Game.Points)
                    : gameQuery.OrderByDescending(x => x.Game.Points);
            }
            else if (request.SortByAchievementCount != null)
            {
                gameQuery = request.SortByAchievementCount == true
                    ? gameQuery.OrderBy(x => x.Game.AchievementCount)
                    : gameQuery.OrderByDescending(x => x.Game.AchievementCount);
            }
            else if (request.SortByPlayerCount != null)
            {
                gameQuery = request.SortByPlayerCount == true
                    ? gameQuery.OrderBy(x => x.Game.Players)
                    : gameQuery.OrderByDescending(x => x.Game.Players);
            }
            else if (request.SortByGenre != null)
            {
                gameQuery = request.SortByGenre == true
                    ? gameQuery.OrderBy(x => x.Game.GameGenre)
                    : gameQuery.OrderByDescending(x => x.Game.GameGenre);
            }

            var games = await gameQuery
                .Skip(request.Skip)
                .Take(request.Take)
                .Select(x => new LoggedInConsoleGames
                {
                    GameId = x.Game.Id,
                    AchievementCount = x.Game.AchievementCount,
                    AchievementsUnlocked = x.User.UserGameProgress.First(x => x.GameId == x.GameId).AchievementsGained,
                    PercentageComplete = Math.Round(x.GamePercentage, 2),
                    GameGenre = x.Game.GameGenre ?? "Not Set",
                    GameImageUrl = x.Game.ImageIcon,
                    GameTitle = x.Game.Title,
                    PlayerCount = x.Game.Players ?? 0,
                    Points = x.Game.Points,
                    HighestAward = x.HighestAward
                })
                .ToArrayAsync();

            var totalCount = await gameQuery.CountAsync();

            return new GetUserTrackedGamesResponse
            {
                Games = games,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / request.Take),
            };
        }
    }
}
