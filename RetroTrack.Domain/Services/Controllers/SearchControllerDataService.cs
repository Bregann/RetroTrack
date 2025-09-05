using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Controllers.Search.Requests;
using RetroTrack.Domain.DTOs.Controllers.Search.Responses;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class SearchControllerDataService(AppDbContext context) : ISearchControllerDataService
    {
        public async Task<DoSearchResponse> DoSearch(DoSearchRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                throw new ArgumentException("Search term cannot be empty");
            }

            var gamesQuery = context.Games.AsQueryable();
            var achievementsQuery = context.Achievements.AsQueryable();

            if (request.ConsoleId != -1) // we treat -1 as all consoles
            {
                gamesQuery = gamesQuery.Where(g => g.ConsoleId == request.ConsoleId);
                achievementsQuery = achievementsQuery.Where(a => a.Game.ConsoleId == request.ConsoleId);
            }

            // filter by search term
            var searchTerm = request.SearchTerm.ToLower().Trim();

            gamesQuery = gamesQuery.Where(g => g.Title.ToLower().Contains(searchTerm));
            achievementsQuery = achievementsQuery.Where(a => a.AchievementName.ToLower().Contains(searchTerm) || a.AchievementDescription.ToLower().Contains(searchTerm));

            // take the total counts before pagination
            var totalGameResults = await gamesQuery.CountAsync();
            var totalAchievementResults = await achievementsQuery.CountAsync();

            // take the requested amount of results
            gamesQuery = gamesQuery.Skip(request.Skip).Take(request.Take);
            achievementsQuery = achievementsQuery.Skip(request.Skip).Take(request.Take);

            // order the results
            switch (request.OrderBy)
            {
                case Enums.OrderByType.AlphabeticalAtoZ:
                    gamesQuery = gamesQuery.OrderBy(g => g.Title);
                    achievementsQuery = achievementsQuery.OrderBy(a => a.AchievementName);
                    break;
                case Enums.OrderByType.AlphabeticalZtoA:
                    gamesQuery = gamesQuery.OrderByDescending(g => g.Title);
                    achievementsQuery = achievementsQuery.OrderByDescending(a => a.AchievementName);
                    break;
                case Enums.OrderByType.TotalAchievementsAsc:
                    gamesQuery = gamesQuery.OrderBy(g => g.Achievements.Count);
                    achievementsQuery = achievementsQuery.OrderBy(a => a.Id);
                    break;
                case Enums.OrderByType.TotalAchievementsDesc:
                    gamesQuery = gamesQuery.OrderByDescending(g => g.Achievements.Count);
                    achievementsQuery = achievementsQuery.OrderBy(a => a.Id);
                    break;
                case Enums.OrderByType.PointsAsc:
                    gamesQuery = gamesQuery.OrderBy(g => g.Achievements.Sum(a => a.Points));
                    achievementsQuery = achievementsQuery.OrderBy(a => a.Points);
                    break;
                case Enums.OrderByType.PointsDesc:
                    gamesQuery = gamesQuery.OrderByDescending(g => g.Achievements.Sum(a => a.Points));
                    achievementsQuery = achievementsQuery.OrderByDescending(a => a.Points);
                    break;
                case Enums.OrderByType.RecentlyAdded:
                    gamesQuery = gamesQuery.OrderByDescending(g => g.LastExtraDataProcessedDate);
                    achievementsQuery = achievementsQuery.OrderByDescending(a => a.DateCreated);
                    break;
                default:
                    break;
            }

            var games = await gamesQuery
                .Select(g => new GameSearchResult
                {
                    GameId = g.Id,
                    Title = g.Title,
                    Console = g.GameConsole.ConsoleName,
                    GameIconUrl = g.ImageIcon,
                    TotalAchievements = g.Achievements.Count,
                    TotalPoints = g.Achievements.Sum(a => a.Points),
                    Genre = g.GameGenre ?? "Unknown"
                })
                .ToArrayAsync();

            var achievements = await achievementsQuery
                .Select(a => new AchievementSearchResult
                {
                    AchievementId = a.Id,
                    Title = a.AchievementName,
                    Description = a.AchievementDescription,
                    IconUrl = a.AchievementIcon,
                    Points = a.Points,
                    GameId = a.Game.Id,
                    GameTitle = a.Game.Title,
                    Console = a.Game.GameConsole.ConsoleName
                })
                .ToArrayAsync();

            return new DoSearchResponse
            {
                TotalGameResults = totalGameResults,
                TotalAchievementResults = totalAchievementResults,
                GameResults = games,
                AchievementResults = achievements
            };
        }

        public async Task<GetSearchConsolesResponse> GetSearchConsoles()
        {
            var consoles = new List<SearchConsoleItem>
            {
                new SearchConsoleItem { Id = -1, Name = "All Consoles" } // special case for all consoles
            };

            var dbConsoles =  await context.GameConsoles
                .OrderBy(c => c.ConsoleName)
                .Select(c => new SearchConsoleItem
                {
                    Id = c.ConsoleId,
                    Name = c.ConsoleName
                })
                .ToListAsync();

            consoles.AddRange(dbConsoles);

            return new GetSearchConsolesResponse
            {
                Consoles = consoles
            };
        }
    }
}
