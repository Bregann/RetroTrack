using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Data.LoggedIn.TrackedGames
{
    public class TrackedGames
    {
        public static bool AddNewTrackedGame(string username, int gameId)
        {
            using(var context = new DatabaseContext())
            {
                var user = context.Users.Where(x=> x.Username == username).First();

                context.TrackedGames.Add(new Infrastructure.Database.Models.TrackedGames 
                { 
                    Game = context.Games.Where(x => x.Id == gameId).First(), 
                    User = user 
                });

                context.SaveChanges();
                return true;
            }
        }

        public static bool RemoveTrackedGame(string username, int gameId)
        {
            using(var context = new DatabaseContext())
            {
                context.TrackedGames.Where(x => x.Game.Id == gameId && x.User.Username == username).ExecuteDelete();
                return true;
            }
        }

        public static List<UserGamesTableDto> GetTrackedGamesForUser(string username)
        {
            using (var context = new DatabaseContext())
            {
                var gameList = context.TrackedGames.Where(x => x.User.Username == username).Include(x => x.Game.GameConsole).Include(x => x.User.UserGameProgress);
                var trackedGameList = new List<UserGamesTableDto>();

                foreach (var game in gameList)
                {
                    var userProgress = game.User.UserGameProgress.Where(x => x.GameID == game.Game.Id && x.User.Username == username).FirstOrDefault();

                    if (userProgress !=  null)
                    {
                        trackedGameList.Add(new UserGamesTableDto
                        {
                            GameId = game.Game.Id,
                            GameName = game.Game.Title,
                            GameGenre = game.Game.GameGenre,
                            GameIconUrl = game.Game.ImageIcon,
                            AchievementCount = game.Game.AchievementCount,
                            Console = game.Game.GameConsole.ConsoleName,
                            AchievementsGained = userProgress.AchievementsGained,
                            PercentageCompleted = userProgress.GamePercentage
                        });

                        continue;
                    }
                    trackedGameList.Add(new UserGamesTableDto
                    {
                        GameId = game.Game.Id,
                        GameName = game.Game.Title,
                        GameGenre = game.Game.GameGenre,
                        GameIconUrl = game.Game.ImageIcon,
                        AchievementCount = game.Game.AchievementCount,
                        Console = game.Game.GameConsole.ConsoleName,
                        AchievementsGained = 0,
                        PercentageCompleted = 0
                    });
                }

                return trackedGameList;
            }
        }
    }
}
