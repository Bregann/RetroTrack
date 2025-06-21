using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class TrackedGamesControllerDataService(AppDbContext context) : ITrackedGamesControllerDataService
    {
        public async Task<bool> AddNewTrackedGame(int userId, int gameId)
        {
            var user = await context.Users.Where(x => x.Id == userId).FirstAsync();

            if (await context.TrackedGames.AnyAsync(x => x.Game.Id == gameId && x.User == user))
            {
                return false;
            }

            await context.TrackedGames.AddAsync(new TrackedGame
            {
                GameId = gameId,
                UserId = user.Id
            });

            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveTrackedGame(int userId, int gameId)
        {
            await context.TrackedGames.Where(x => x.Game.Id == gameId && x.UserId == userId).ExecuteDeleteAsync();
            return true;
        }

        public async Task<List<UserGamesTableDto>> GetTrackedGamesForUser(int userId)
        {
            var gameList = await context.TrackedGames.Where(x => x.UserId == userId).ToListAsync();
            var userGameProgress = await context.UserGameProgress.Where(x => x.UserId == userId).ToListAsync();

            var trackedGameList = new List<UserGamesTableDto>();

            foreach (var game in gameList)
            {
                var userProgress = userGameProgress.Where(x => x.Game.Id == game.Game.Id).FirstOrDefault();

                trackedGameList.Add(new UserGamesTableDto
                {
                    AchievementCount = game.Game.AchievementCount,
                    AchievementsGained = userProgress?.AchievementsGained ?? 0,
                    PercentageCompleted = userProgress?.GamePercentage ?? 0,
                    GameGenre = game.Game.GameGenre,
                    GameIconUrl = "https://media.retroachievements.org" + game.Game.ImageIcon,
                    GameId = game.Game.Id,
                    GameName = game.Game.Title,
                    Console = game.Game.GameConsole.ConsoleName,
                    Players = game.Game.Players ?? 0
                });
            }

            return trackedGameList;
        }
    }
}
