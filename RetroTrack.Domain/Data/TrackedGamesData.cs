using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Models;

namespace RetroTrack.Domain.Data
{
    public class TrackedGamesData
    {
        public static bool AddNewTrackedGame(string username, int gameId)
        {
            using (var context = new DatabaseContext())
            {
                var user = context.Users.Where(x => x.Username == username).First();

                if (context.TrackedGames.Any(x => x.Game.Id == gameId && x.User == user))
                {
                    return false;
                }

                context.TrackedGames.Add(new TrackedGames
                {
                    Id = $"{gameId}-{user.Username}",
                    Game = context.Games.Where(x => x.Id == gameId).First(),
                    User = user
                });

                context.SaveChanges();
                return true;
            }
        }

        public static bool RemoveTrackedGame(string username, int gameId)
        {
            using (var context = new DatabaseContext())
            {
                context.TrackedGames.Where(x => x.Game.Id == gameId && x.User.Username == username).ExecuteDelete();
                return true;
            }
        }

        public static List<UserGamesTableDto> GetTrackedGamesForUser(string username)
        {
            using (var context = new DatabaseContext())
            {
                var gameList = context.TrackedGames.Where(x => x.User.Username == username).Include(x => x.Game).Include(x => x.Game.GameConsole).ToList();
                var userGameProgress = context.UserGameProgress.Where(x => x.User.Username == username).Include(x => x.Game).ToList();

                var trackedGameList = new List<UserGamesTableDto>();

                foreach (var game in gameList)
                {
                    var userProgress = userGameProgress.Where(x => x.Game.Id == game.Game.Id).FirstOrDefault();

                    trackedGameList.Add(new UserGamesTableDto
                    {
                        AchievementCount = game.Game.AchievementCount,
                        AchievementsGained = userProgress?.AchievementsGained ?? 0,
                        PercentageCompleted = userProgress?.GamePercentage * 100 ?? 0,
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
}