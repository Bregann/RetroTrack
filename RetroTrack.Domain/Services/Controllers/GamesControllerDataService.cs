using BreganUtils;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.DTOs.Helpers;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;
using Achievement = RetroTrack.Domain.DTOs.Controllers.Games.Achievement;
using UserAchievement = RetroTrack.Domain.DTOs.Controllers.Games.UserAchievement;

namespace RetroTrack.Domain.Services.Controllers
{
    public class GamesControllerDataService(AppDbContext context, IRetroAchievementsApiService raApiService, ICachingService cachingService) : IGamesControllerDataService
    {
        public async Task<List<DayListDto>> GetNewAndUpdatedGamesFromLast5Days()
        {
            var dayList = new List<DayListDto>();

            for (int i = 0; i < 5; i++)
            {
                if (i == 0)
                {
                    var gamesFromDay = await context.Games.Where(x => x.ExtraDataProcessed && x.LastModified.Date == DateTime.UtcNow.Date).ToListAsync();
                    var gamesTable = new List<PublicGamesTableDto>();

                    gamesTable.AddRange(gamesFromDay.Select(games => new PublicGamesTableDto
                    {
                        AchievementCount = games.AchievementCount,
                        GameGenre = games.GameGenre ?? "",
                        GameIconUrl = "https://media.retroachievements.org" + games.ImageIcon,
                        Console = games.GameConsole.ConsoleName,
                        GameId = games.Id,
                        GameName = games.Title,
                        Players = games.Players ?? 0
                    }));

                    dayList.Add(new DayListDto
                    {
                        Date = DateTimeHelper.HumanizeDateTime(DateTime.UtcNow.Date),
                        GamesTable = gamesTable
                    });
                }
                else
                {
                    var gamesFromDay = await context.Games.Where(x => x.ExtraDataProcessed && x.LastModified.Date == DateTime.UtcNow.AddDays(i * -1).Date).ToListAsync();

                    var gamesTable = new List<PublicGamesTableDto>();

                    gamesTable.AddRange(gamesFromDay.Select(games => new PublicGamesTableDto
                    {
                        AchievementCount = games.AchievementCount,
                        GameGenre = games.GameGenre ?? "",
                        GameIconUrl = "https://media.retroachievements.org" + games.ImageIcon,
                        Console = games.GameConsole.ConsoleName,
                        GameId = games.Id,
                        GameName = games.Title,
                        Players = games.Players ?? 0
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

        public async Task<GameInfoDto?> GetSpecificGameInfo(int gameId)
        {
            var data = await raApiService.GetSpecificGameInfo(gameId);

            if (data == null)
            {
                return null;
            }

            return new GameInfoDto
            {
                GameId = data.Id,
                ImageBoxArt = "https://media.retroachievements.org" + data.ImageBoxArt,
                ImageTitle = "https://media.retroachievements.org" + data.ImageTitle,
                ImageInGame = "https://media.retroachievements.org" + data.ImageInGame,
                ConsoleId = data.ConsoleId,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                AchievementCount = data.AchievementCount,
                Players = data.Players,
                Title = data.Title,
                Achievements = data.Achievements == null ? [] : data.Achievements.Select(x => new Achievement
                {
                    Id = x.Value.Id,
                    BadgeName = "https://media.retroachievements.org/Badge/" + x.Value.BadgeName + ".png",
                    Description = x.Value.Description,
                    NumAwarded = x.Value.NumAwarded,
                    NumAwardedHardcore = x.Value.NumAwardedHardcore,
                    Points = x.Value.Points,
                    Title = x.Value.Title,
                    Type = x.Value.Type,
                }).ToList()
            };
        }

        public async Task<PublicConsoleGamesDto?> GetGamesForConsole(int consoleId)
        {
            var cacheData = await cachingService.GetCacheItem($"GamesData-{consoleId}");
            var gameList = new List<Games>();

            if (cacheData != null)
            {
                gameList = JsonConvert.DeserializeObject<List<Games>>(cacheData);
            }
            else
            {
                if (consoleId == 0)
                {
                    gameList = await context.Games.ToListAsync();
                }
                else
                {
                    gameList = await context.Games.Where(x => x.GameConsole.ConsoleID == consoleId).ToListAsync();
                }

                await cachingService.AddOrUpdateCacheItem($"GamesData-{consoleId}", JsonConvert.SerializeObject(gameList));
            }

            if (gameList == null || gameList.Count == 0)
            {
                return null;
            }

            return new PublicConsoleGamesDto
            {
                ConsoleId = consoleId,
                ConsoleName = consoleId == 0 ? "All Games" : context.GameConsoles.Where(x => x.ConsoleID == consoleId).First().ConsoleName,
                Games = gameList.Select(x => new PublicGamesTableDto
                {
                    AchievementCount = x.AchievementCount,
                    Console = x.GameConsole.ConsoleName,
                    GameGenre = x.GameGenre ?? "",
                    GameIconUrl = "https://media.retroachievements.org" + x.ImageIcon,
                    GameId = x.Id,
                    GameName = x.Title,
                    Players = x.Players ?? 0
                }).ToList()
            };
        }

        public async Task<UserGameInfoDto?> GetUserGameInfo(UserDataDto userData, int gameId)
        {
            var user = context.Users.Where(x => x.Id == userData.UserId).First();

            var data = await raApiService.GetSpecificGameInfoAndUserProgress(user.LoginUsername, userData.RaUlid, gameId);
            var achievementList = new List<UserAchievement>();

            //If its null, grab the regular data so the popup will still work
            if (data == null)
            {
                var loggedOutData = await raApiService.GetSpecificGameInfo(gameId);

                if (loggedOutData == null || loggedOutData.Achievements == null)
                {
                    return null;
                }

                achievementList.AddRange(loggedOutData.Achievements.Select(achievement => new UserAchievement
                {
                    BadgeName = "https://media.retroachievements.org/Badge/" + achievement.Value.BadgeName + ".png",
                    DateEarned = null,
                    Description = achievement.Value.Description,
                    Id = achievement.Value.Id,
                    Points = achievement.Value.Points,
                    Title = achievement.Value.Title,
                    Type = AchievementType.Unknown // temp fix till rewrite todo: fix
                }));

                return new UserGameInfoDto
                {
                    AchievementCount = loggedOutData.AchievementCount,
                    Achievements = achievementList,
                    ImageBoxArt = "https://media.retroachievements.org" + loggedOutData.ImageBoxArt,
                    ImageTitle = "https://media.retroachievements.org" + loggedOutData.ImageTitle,
                    ImageInGame = "https://media.retroachievements.org" + loggedOutData.ImageInGame,
                    NumAwardedToUser = 0,
                    ConsoleId = loggedOutData.ConsoleId,
                    ConsoleName = loggedOutData.ConsoleName,
                    GameId = gameId,
                    Genre = loggedOutData.Genre,
                    Players = loggedOutData.Players,
                    PointsEarned = 0,
                    Title = loggedOutData.Title,
                    TotalPoints = loggedOutData.Achievements.Sum(x => x.Value.Points),
                    UserCompletion = "Unable to fetch data",
                    GameTracked = context.TrackedGames.Any(x => x.UserId == userData.UserId && x.Game.Id == gameId)
                };
            }


            context.Games.First(x => x.Id == gameId).Players = data.Players;
            user.LastAchievementsUpdate = DateTime.UtcNow;
            await context.SaveChangesAsync();

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
                    DateEarned = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned),
                    Type = achievement.Value.Type
                });
            }

            return new UserGameInfoDto
            {
                GameId = data.Id,
                ImageBoxArt = "https://media.retroachievements.org" + data.ImageBoxArt,
                ImageTitle = "https://media.retroachievements.org" + data.ImageTitle,
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
                GameTracked = context.TrackedGames.Any(x => x.UserId == userData.UserId && x.Game.Id == gameId)
            };
        }

        public async Task<UserAchievementsForGameDto> GetUserAchievementsForGame(UserDataDto userData, int gameId)
        {
            var user = context.Users.Where(x => x.Id == userData.UserId).First();

            var data = await raApiService.GetSpecificGameInfoAndUserProgress(user.LoginUsername, user.RAUserUlid, gameId);

            if (data == null)
            {
                return new UserAchievementsForGameDto
                {
                    Achievements = null,
                    Success = false,
                    Reason = "Error getting data"
                };
            }

            context.Games.First(x => x.Id == gameId).Players = data.Players;
            await context.SaveChangesAsync();

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
            await context.SaveChangesAsync();

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
                    DateEarned = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned),
                    Type = achievement.Value.Type
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

        public async Task<UserConsoleGamesDto?> GetGamesAndUserProgressForConsole(UserDataDto userData, int consoleId)
        {
            var consoleGames = new List<UserGamesTableDto>();

            var cacheData = await cachingService.GetCacheItem($"GamesData-{consoleId}");
            var gameList = new List<Games>();

            if (cacheData != null)
            {
                gameList = JsonConvert.DeserializeObject<List<Games>>(cacheData);
            }
            else
            {
                if (consoleId == 0)
                {
                    gameList = await context.Games.ToListAsync();
                }
                else
                {
                    gameList = await context.Games.Where(x => x.GameConsole.ConsoleID == consoleId).ToListAsync();
                }

                await cachingService.AddOrUpdateCacheItem($"GamesData-{consoleId}", JsonConvert.SerializeObject(gameList));
            }

            if (gameList == null || gameList.Count == 0)
            {
                return null;
            }

            if (consoleId == 0)
            {
                //User progress is cached, check and return if needed
                var userAllGamesCacheData = await cachingService.GetCacheItem($"GamesData-{consoleId}-User-{userData.Username}");

                if (userAllGamesCacheData != null)
                {
                    return JsonConvert.DeserializeObject<UserConsoleGamesDto>(userAllGamesCacheData);
                }

                var allGamesUserProgress = new UserConsoleGamesDto
                {
                    ConsoleId = consoleId,
                    ConsoleName = "All Games",
                    Games = consoleGames
                };

                await cachingService.AddOrUpdateCacheItem($"GamesData-{consoleId}-User-{userData.Username}", JsonConvert.SerializeObject(allGamesUserProgress));
                return allGamesUserProgress;
            }

            foreach (var game in gameList)
            {
                var userProgress = await context.UserGameProgress.Where(x => x.UserId == userData.UserId).FirstOrDefaultAsync(x => x.Game.Id == game.Id);

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
                ConsoleName = consoleId == 0 ? "All Games" : context.GameConsoles.Where(x => x.ConsoleID == consoleId).First().ConsoleName,
                Games = consoleGames
            };
        }

        public async Task<List<UserGamesTableDto>> GetInProgressGamesForUser(UserDataDto userData)
        {
            var gameList = await context.UserGameProgress.Where(x => x.UserId == userData.UserId && x.GamePercentage != 1).ToListAsync();
            var progressGameList = new List<UserGamesTableDto>();

            foreach (var game in gameList)
            {
                if (game == null || game.Game == null)
                {
                    continue;
                }

                double gamePct = 0;

                if (game?.GamePercentage != null)
                {
                    gamePct = Math.Round(game.GamePercentage * 100, 2);
                }

                progressGameList.Add(new UserGamesTableDto
                {
                    AchievementCount = game?.Game.AchievementCount ?? 0,
                    AchievementsGained = game?.AchievementsGained ?? 0,
                    PercentageCompleted = gamePct,
                    GameGenre = game?.Game.GameGenre,
                    GameIconUrl = "https://media.retroachievements.org" + game?.Game.ImageIcon,
                    GameId = game?.Game.Id ?? 0,
                    GameName = game?.Game.Title ?? "",
                    Console = game?.Game.GameConsole.ConsoleName ?? "",
                    Players = game?.Game.Players ?? 0
                });
            }

            return progressGameList;
        }
    }
}
