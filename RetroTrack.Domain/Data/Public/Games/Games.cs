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
                    BadgeName = x.Value.BadgeName,
                    Description= x.Value.Description,
                    NumAwarded = x.Value.NumAwarded,
                    NumAwardedHardcore = x.Value.NumAwardedHardcore,
                    Points = x.Value.Points,
                    Title = x.Value.Title
                }).ToList()
            };
        }
    }
}
