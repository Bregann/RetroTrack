using BreganUtils;
using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
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
                        var gamesTable = new List<GamesTableDto>();

                        gamesTable.AddRange(gamesFromDay.Select(games => new GamesTableDto
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

                        var gamesTable = new List<GamesTableDto>();

                        gamesTable.AddRange(gamesFromDay.Select(games => new GamesTableDto
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

            return new GameInfoDto
            {
                GameId = data.Id,
                ImageBoxArt = data.ImageBoxArt,
                ImageInGame = data.ImageInGame,
                ConsoleId = data.ConsoleId,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                AchievementCount = data.AchievementCount,
                Players = data.Players,
                Title = data.Title,
                Achievements = data.Achievements.Select(x => new Achievement
                {
                    Id = x.Value.Id,
                    BadgeName = x.Value.BadgeName + ".png",
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

            return new UserGameInfoDto
            {
                GameId = data.Id,
                ImageBoxArt = data.ImageBoxArt,
                ImageInGame = data.ImageInGame,
                ConsoleId = data.ConsoleId,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                AchievementCount = data.AchievementCount,
                Players = data.Players,
                Title = data.Title,
                NumAwardedToUser= data.NumAwardedToUser,
                UserCompletion = data.UserCompletion,
                Achievements = achievementList
            };
        }
    }
}
