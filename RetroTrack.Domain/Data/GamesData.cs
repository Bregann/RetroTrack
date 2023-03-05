using BreganUtils;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Caching;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Models;

namespace RetroTrack.Domain.Data
{
    public class GamesData
    {
        public static List<DayListDto> GetNewAndUpdatedGamesFromLast5Days()
        {
            using (var context = new DatabaseContext())
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
                            GameIconUrl = "https://media.retroachievements.org" + games.ImageIcon,
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
                            GameIconUrl = "https://media.retroachievements.org" + games.ImageIcon,
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

            using (var context = new DatabaseContext())
            {
                context.Games.First(x => x.Id == gameId).Players = data.Players;
                context.SaveChanges();
            }

            var achList = new List<Achievement>();

            return new GameInfoDto
            {
                GameId = data.Id,
                ImageBoxArt = "https://media.retroachievements.org" + data.ImageBoxArt,
                ImageInGame = "https://media.retroachievements.org" + data.ImageInGame,
                ConsoleId = data.ConsoleId,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                AchievementCount = data.AchievementCount,
                Players = data.Players,
                Title = data.Title,
                Achievements = data.Achievements.Select(x => new Achievement
                {
                    Id = x.Value.Id,
                    BadgeName = "https://media.retroachievements.org/Badge/" + x.Value.BadgeName + ".png",
                    Description = x.Value.Description,
                    NumAwarded = x.Value.NumAwarded,
                    NumAwardedHardcore = x.Value.NumAwardedHardcore,
                    Points = x.Value.Points,
                    Title = x.Value.Title
                }).ToList()
            };
        }

        public static PublicConsoleGamesDto? GetGamesForConsole(int consoleId)
        {
            using (var context = new DatabaseContext())
            {
                var cacheData = CachingHelper.GetCacheItem($"GamesData-{consoleId}");
                var gameList = new List<Games>();

                if (cacheData != null)
                {
                    gameList = JsonConvert.DeserializeObject<List<Games>>(cacheData);
                }
                else
                {
                    if (consoleId == 0)
                    {
                        gameList = context.Games.ToList();
                    }
                    else
                    {
                        gameList = context.Games.Where(x => x.GameConsole.ConsoleID == consoleId).ToList();
                    }

                    CachingHelper.AddOrUpdateCacheItem($"GamesData-{consoleId}", JsonConvert.SerializeObject(gameList));
                }

                //0 is used for all games
                if (consoleId == 0)
                {
                    return new PublicConsoleGamesDto
                    {
                        ConsoleId = consoleId,
                        ConsoleName = "All Games",
                        Games = gameList.Select(x => new PublicGamesTableDto
                        {
                            AchievementCount = x.AchievementCount,
                            GameGenre = x.GameGenre,
                            GameIconUrl = "https://media.retroachievements.org" + x.ImageIcon,
                            GameId = x.Id,
                            GameName = x.Title
                        }).ToList()
                    };
                }

                if (gameList.Count == 0)
                {
                    return null;
                }

                return new PublicConsoleGamesDto
                {
                    ConsoleId = consoleId,
                    ConsoleName = context.GameConsoles.Where(x => x.ConsoleID == consoleId).First().ConsoleName,
                    Games = gameList.Select(x => new PublicGamesTableDto
                    {
                        AchievementCount = x.AchievementCount,
                        GameGenre = x.GameGenre,
                        GameIconUrl = "https://media.retroachievements.org" + x.ImageIcon,
                        GameId = x.Id,
                        GameName = x.Title
                    }).ToList()
                };
            }
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
                achievementList.Add(new UserAchievement
                {
                    Id = achievement.Value.Id,
                    BadgeName = "https://media.retroachievements.org/Badge/" + (achievement.Value.DateEarned != null ? achievement.Value.BadgeName : achievement.Value.BadgeName + "_lock") + ".png",
                    Description = achievement.Value.Description,
                    NumAwarded = achievement.Value.NumAwarded,
                    NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                    Points = achievement.Value.Points,
                    Title = achievement.Value.Title,
                    DateEarned = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned)
                });
            }

            using (var context = new DatabaseContext())
            {
                return new UserGameInfoDto
                {
                    GameId = data.Id,
                    ImageBoxArt = "https://media.retroachievements.org" + data.ImageBoxArt,
                    ImageInGame = "https://media.retroachievements.org" + data.ImageInGame,
                    ConsoleId = data.ConsoleId,
                    ConsoleName = data.ConsoleName,
                    Genre = data.Genre,
                    AchievementCount = data.AchievementCount,
                    Players = data.Players,
                    Title = data.Title,
                    NumAwardedToUser = data.NumAwardedToUser,
                    UserCompletion = data.UserCompletion,
                    Achievements = achievementList,
                    PointsEarned = data.Achievements.Where(x => x.Value.DateEarned != null).Sum(x => x.Value.Points),
                    TotalPoints = data.Achievements.Sum(x => x.Value.Points),
                    GameTracked = context.TrackedGames.Any(x => x.User.Username == username && x.Game.Id == gameId)
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
                var userAchievement = new UserAchievement
                {
                    Id = achievement.Value.Id,
                    BadgeName = "https://media.retroachievements.org/Badge/" + achievement.Value.BadgeName + ".png",
                    Description = achievement.Value.Description,
                    NumAwarded = achievement.Value.NumAwarded,
                    NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                    Points = achievement.Value.Points,
                    Title = achievement.Value.Title,
                    DateEarned = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned)
                };

                if (achievement.Value.DateEarned == null)
                {
                    userAchievement.BadgeName = "https://media.retroachievements.org/Badge/" + achievement.Value.BadgeName + "_lock.png";
                }

                achievementList.Add(userAchievement);
            }

            return new UserAchievementsForGameDto
            {
                Success = true,
                Achievements = achievementList
            };
        }

        public static UserConsoleGamesDto? GetGamesAndUserProgressForConsole(string username, int consoleId)
        {
            using (var context = new DatabaseContext())
            {
                var userGameProgress = context.UserGameProgress.Where(x => x.User.Username == username).Include(x => x.Game);
                var consoleGames = new List<UserGamesTableDto>();

                var cacheData = CachingHelper.GetCacheItem($"GamesData-{consoleId}");
                var gameList = new List<Games>();

                if (cacheData != null)
                {
                    gameList = JsonConvert.DeserializeObject<List<Games>>(cacheData);
                }
                else
                {
                    if (consoleId == 0)
                    {
                        gameList = context.Games.ToList();
                    }
                    else
                    {
                        gameList = context.Games.Where(x => x.GameConsole.ConsoleID == consoleId).ToList();
                    }

                    CachingHelper.AddOrUpdateCacheItem($"GamesData-{consoleId}", JsonConvert.SerializeObject(gameList));
                }

                if (consoleId == 0)
                {
                    //User progress is cached, check and return if needed
                    var userAllGamesCacheData = CachingHelper.GetCacheItem($"GamesData-{consoleId}-User-{username}");

                    if (userAllGamesCacheData != null)
                    {
                        return JsonConvert.DeserializeObject<UserConsoleGamesDto>(userAllGamesCacheData);
                    }

                    foreach (var game in gameList)
                    {
                        var userProgress = userGameProgress.FirstOrDefault(x => x.Game.Id == game.Id);

                        consoleGames.Add(new UserGamesTableDto
                        {
                            AchievementCount = game.AchievementCount,
                            AchievementsGained = userProgress?.AchievementsGained ?? 0,
                            PercentageCompleted = userProgress?.GamePercentage * 100 ?? 0,
                            GameGenre = game.GameGenre,
                            GameIconUrl = "https://media.retroachievements.org" + game.ImageIcon,
                            GameId = game.Id,
                            GameName = game.Title,
                            Players = game.Players ?? 0
                        });
                    }

                    var allGamesUserProgress = new UserConsoleGamesDto
                    {
                        ConsoleId = consoleId,
                        ConsoleName = "All Games",
                        Games = consoleGames
                    };

                    CachingHelper.AddOrUpdateCacheItem($"GamesData-{consoleId}-User-{username}", JsonConvert.SerializeObject(allGamesUserProgress));
                    return allGamesUserProgress;
                }
                else
                {
                    foreach (var game in gameList)
                    {
                        var userProgress = userGameProgress.FirstOrDefault(x => x.Game.Id == game.Id);

                        consoleGames.Add(new UserGamesTableDto
                        {
                            AchievementCount = game.AchievementCount,
                            AchievementsGained = userProgress?.AchievementsGained ?? 0,
                            PercentageCompleted = userProgress?.GamePercentage * 100 ?? 0,
                            GameGenre = game.GameGenre,
                            GameIconUrl = "https://media.retroachievements.org" + game.ImageIcon,
                            GameId = game.Id,
                            GameName = game.Title,
                            Players = game.Players ?? 0
                        });
                    }

                    return new UserConsoleGamesDto
                    {
                        ConsoleId = consoleId,
                        ConsoleName = context.GameConsoles.Where(x => x.ConsoleID == consoleId).First().ConsoleName,
                        Games = consoleGames
                    };
                }
            }
        }

        public static List<UserGamesTableDto> GetInProgressGamesForUser(string username)
        {
            using (var context = new DatabaseContext())
            {
                var gameList = context.UserGameProgress.Include(x => x.Game).Include(x => x.Game.GameConsole).Where(x => x.User.Username == username && x.GamePercentage != 1);
                var progressGameList = new List<UserGamesTableDto>();

                foreach (var game in gameList)
                {
                    double gamePct = 0;

                    if(game?.GamePercentage != null)
                    {
                        gamePct = Math.Round((game.GamePercentage * 100), 2);
                    }

                    progressGameList.Add(new UserGamesTableDto
                    {
                        AchievementCount = game.Game.AchievementCount,
                        AchievementsGained = game?.AchievementsGained ?? 0,
                        PercentageCompleted = gamePct,
                        GameGenre = game.Game.GameGenre,
                        GameIconUrl = "https://media.retroachievements.org" + game.Game.ImageIcon,
                        GameId = game.Game.Id,
                        GameName = game.Game.Title,
                        Console = game.Game.GameConsole.ConsoleName,
                        Players = game.Game.Players ?? 0
                    });
                }

                return progressGameList;
            }
        }
    }
}