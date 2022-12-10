using BreganUtils;
using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Data.Public.Games
{
    public class Games
    {
        public static List<DayListDto> GetNewAndUpdatedGamesFromLast5Days()
        {
            using(var context = new DatabaseContext())
            {
                var dayList = new List<DayListDto>();

                for (int i = 0; i < 5; i++)
                {
                    if (i == 0)
                    {
                        var gamesFromDay = context.Games.Where(x => x.ExtraDataProcessed && x.LastModified.Date == DateTime.UtcNow.Date).Include(x => x.GameConsole).ToList();
                        var gamesTable = new List<PublicGamesTableDto>();

                        gamesTable.AddRange(gamesFromDay.Select(games => new PublicGamesTableDto
                        {
                            AchievementCount = games.AchievementCount,
                            GameGenre = games.GameGenre,
                            GameIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + games.ImageIcon,
                            Console = games.GameConsole.ConsoleName,
                            GameId = games.Id,
                            GameName = games.Title
                        }));

                        dayList.Add(new DayListDto
                        {
                            Date = DateTimeHelper.HumanizeDateTime(DateTime.UtcNow.Date),
                            GamesTable = gamesTable
                        });
                    }
                    else
                    {
                        var gamesFromDay = context.Games.Where(x => x.ExtraDataProcessed && x.LastModified.Date == DateTime.UtcNow.AddDays(i * -1).Date).Include(x => x.GameConsole).ToList();

                        var gamesTable = new List<PublicGamesTableDto>();

                        gamesTable.AddRange(gamesFromDay.Select(games => new PublicGamesTableDto
                        {
                            AchievementCount = games.AchievementCount,
                            GameGenre = games.GameGenre,
                            GameIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + games.ImageIcon,
                            Console = games.GameConsole.ConsoleName,
                            GameId = games.Id,
                            GameName = games.Title
                        }));

                        dayList.Add(new DayListDto
                        {
                            Date = DateTimeHelper.HumanizeDateTime(DateTime.UtcNow.Date.AddDays(i * -1)),
                            GamesTable = gamesTable
                        });
                    }
                }

                return dayList;
            }
        }

        public static async Task<GameInfoDto?> GetSpecificGameInfo(int gameId)
        {
            var data = await RetroAchievements.GetSpecificGameInfo(gameId);

            if (data == null)
            {
                return null;
            }

            using(var context = new DatabaseContext())
            {
                context.Games.First(x => x.Id == gameId).Players = data.Players;
                context.SaveChanges();
            }

            var achList = new List<Achievement>();

            return new GameInfoDto
            {
                GameId = data.Id,
                ImageBoxArt = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + data.ImageBoxArt,
                ImageInGame = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + data.ImageInGame,
                ConsoleId = data.ConsoleId,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                AchievementCount = data.AchievementCount,
                Players = data.Players,
                Title = data.Title,
                Achievements = data.Achievements.Select(x => new Achievement
                {
                    Id = x.Value.Id,
                    BadgeName = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + x.Value.BadgeName + ".png",
                    Description= x.Value.Description,
                    NumAwarded = x.Value.NumAwarded,
                    NumAwardedHardcore = x.Value.NumAwardedHardcore,
                    Points = x.Value.Points,
                    Title = x.Value.Title
                }).ToList()
            };
        }

        public static async Task<UserGameInfoDto?> GetUserGameInfo(string username, int gameId)
        {
            var data = await RetroAchievements.GetSpecificGameInfoAndUserProgress(gameId, username);

            if (data == null)
            {
                return null;
            }

            using (var context = new DatabaseContext())
            {
                context.Games.First(x => x.Id == gameId).Players = data.Players;
                context.Users.First(x => x.Username == username).LastAchievementsUpdate = DateTime.UtcNow;
                context.SaveChanges();
            }

            var achievementList = new List<UserAchievement>();

            foreach (var achievement in data.Achievements.OrderByDescending(x => x.Value.DateEarned))
            {
                if (achievement.Value.DateEarned != null)
                {
                    achievementList.Add(new UserAchievement
                    {
                        Id = achievement.Value.Id,
                        BadgeName = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievement.Value.BadgeName + ".png",
                        Description = achievement.Value.Description,
                        NumAwarded = achievement.Value.NumAwarded,
                        NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                        Points = achievement.Value.Points,
                        Title = achievement.Value.Title,
                        DateEarned = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned)
                    });
                }
                else
                {
                    achievementList.Add(new UserAchievement
                    {
                        Id = achievement.Value.Id,
                        BadgeName = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievement.Value.BadgeName + "_lock.png",
                        Description = achievement.Value.Description,
                        NumAwarded = achievement.Value.NumAwarded,
                        NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                        Points = achievement.Value.Points,
                        Title = achievement.Value.Title,
                        DateEarned = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned)
                    });
                }
            }

            using(var context = new DatabaseContext())
            {
                return new UserGameInfoDto
                {
                    GameId = data.Id,
                    ImageBoxArt = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + data.ImageBoxArt,
                    ImageInGame = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + data.ImageInGame,
                    ConsoleId = data.ConsoleId,
                    ConsoleName = data.ConsoleName,
                    Genre = data.Genre,
                    AchievementCount = data.AchievementCount,
                    Players = data.Players,
                    Title = data.Title,
                    NumAwardedToUser = data.NumAwardedToUser,
                    UserCompletion = data.UserCompletion,
                    Achievements = achievementList,
                    GameTracked = context.TrackedGames.Any(x => x.User.Username == username && x.Game.Id== gameId)
                };
            }
        }

        public static async Task<UserAchievementsForGameDto> GetUserAchievementsForGame(string username, int gameId)
        {
            var data = await RetroAchievements.GetSpecificGameInfoAndUserProgress(gameId, username);

            if (data == null)
            {
                return new UserAchievementsForGameDto
                {
                    Achievements = null,
                    Success = false,
                    Reason = "Error getting data"
                };
     
            }

            using (var context = new DatabaseContext())
            {
                context.Games.First(x => x.Id == gameId).Players = data.Players;
                context.SaveChanges();

                var user = context.Users.Where(x => x.Username == username).First();
                var secondsDiff = (DateTime.UtcNow - user.LastAchievementsUpdate).TotalSeconds;

                if (secondsDiff < 30)
                {
                    return new UserAchievementsForGameDto
                    {
                        Achievements = null,
                        Success = false,
                        Reason = $"Achievement update is on cooldown! You can next update in {30 - Math.Round(secondsDiff)} seconds time"
                    };
                }

                user.LastAchievementsUpdate = DateTime.UtcNow;
                context.SaveChanges();
            }

            var achievementList = new List<UserAchievement>();

            foreach (var achievement in data.Achievements.OrderByDescending(x => x.Value.DateEarned))
            {
                if (achievement.Value.DateEarned != null)
                {
                    achievementList.Add(new UserAchievement
                    {
                        Id = achievement.Value.Id,
                        BadgeName = achievement.Value.BadgeName + ".png",
                        Description = achievement.Value.Description,
                        NumAwarded = achievement.Value.NumAwarded,
                        NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                        Points = achievement.Value.Points,
                        Title = achievement.Value.Title,
                        DateEarned = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned)
                    });
                }
                else
                {
                    achievementList.Add(new UserAchievement
                    {
                        Id = achievement.Value.Id,
                        BadgeName = achievement.Value.BadgeName + "_lock.png",
                        Description = achievement.Value.Description,
                        NumAwarded = achievement.Value.NumAwarded,
                        NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                        Points = achievement.Value.Points,
                        Title = achievement.Value.Title,
                        DateEarned = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned)
                    });
                }
            }

            return new UserAchievementsForGameDto 
            { 
                Success = true,
                Achievements = achievementList 
            };
        }

        public static PublicConsoleGamesDto? GetGamesForConsole(int consoleId)
        {
            using(var context = new DatabaseContext())
            {
                //0 is used for all games
                if (consoleId == 0)
                {
                    return new PublicConsoleGamesDto
                    {
                        ConsoleId = consoleId,
                        ConsoleName = "All Games",
                        Games = context.Games.Select(x => new PublicGamesTableDto
                        {
                            AchievementCount = x.AchievementCount,
                            GameGenre = x.GameGenre,
                            GameIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + x.ImageIcon,
                            GameId = x.Id,
                            GameName = x.Title
                        }).ToList()
                    };
                }

                var consoleGames = context.Games.Where(x => x.GameConsole.ConsoleID == consoleId).ToList();

                if (consoleGames.Count == 0)
                {
                    return null;
                }

                return new PublicConsoleGamesDto
                {
                    ConsoleId = consoleId,
                    ConsoleName = context.GameConsoles.Where(x => x.ConsoleID == consoleId).First().ConsoleName,
                    Games = consoleGames.Select(x => new PublicGamesTableDto
                    {
                        AchievementCount = x.AchievementCount,
                        GameGenre = x.GameGenre,
                        GameIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + x.ImageIcon,
                        GameId = x.Id,
                        GameName = x.Title
                    }).ToList()
                };
            }
        }
    }
}
