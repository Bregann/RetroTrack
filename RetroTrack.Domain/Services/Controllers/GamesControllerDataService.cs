using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Games;
using RetroTrack.Domain.DTOs.Controllers.Games.Requests;
using RetroTrack.Domain.DTOs.Controllers.Games.Responses;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Helpers;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;
using Achievement = RetroTrack.Domain.DTOs.Controllers.Games.Responses.Achievement;
using UserAchievement = RetroTrack.Domain.DTOs.Controllers.Games.UserAchievement;

namespace RetroTrack.Domain.Services.Controllers
{
    public class GamesControllerDataService(AppDbContext context, IRetroAchievementsApiService raApiService) : IGamesControllerDataService
    {
        public async Task<GetRecentlyAddedAndUpdatedGamesResponse> GetRecentlyAddedAndUpdatedGames()
        {
            var days = new List<DayData>();

            // get the last 5 days of data
            for (int i = 0; i < 5; i++)
            {
                var date = DateTime.UtcNow.AddDays(-i);
                var newSets = await context.Games
                    .Where(x => x.SetReleasedDate.Date == date.Date && x.HasAchievements)
                    .Select(x => new GameData
                    {
                        GameId = x.Id,
                        Title = x.Title,
                        GameIcon = x.ImageIcon,
                        ConsoleName = x.GameConsole.ConsoleName,
                        ConsoleType = x.GameConsole.ConsoleType,
                        AchievementCount = x.AchievementCount.ToString(),
                        Points = x.Points.ToString()
                    }).ToArrayAsync();

                var updatedSets = await context.Games
                    .Where(x => x.LastModified.Date == date.Date && x.SetReleasedDate != date.Date && x.HasAchievements)
                    .Select(x => new GameData
                    {
                        GameId = x.Id,
                        Title = x.Title,
                        GameIcon = x.ImageIcon,
                        ConsoleName = x.GameConsole.ConsoleName,
                        ConsoleType = x.GameConsole.ConsoleType,
                        AchievementCount = x.AchievementCount.ToString(),
                        Points = x.Points.ToString()
                    }).ToArrayAsync();

                days.Add(new DayData
                {
                    Date = DateTimeHelper.HumanizeDateTime(date),
                    NewSets = newSets,
                    UpdatedSets = updatedSets
                });
            }

            return new GetRecentlyAddedAndUpdatedGamesResponse
            {
                Days = days
            };
        }

        public async Task<GetGamesForConsoleResponse> GetGamesForConsole(GetGamesForConsoleRequest request)
        {
            IQueryable<Game> gameQuery;

            if (request.ConsoleId == -1)
            {
                gameQuery = context.Games
                    .Where(x => x.HasAchievements)
                    .OrderBy(x => x.Id)
                    .AsQueryable();
            }
            else
            {
                gameQuery = context.Games
                    .Where(x => x.ConsoleId == request.ConsoleId && x.HasAchievements)
                    .OrderBy(x => x.Id)
                    .AsQueryable();
            }

            if (request.SearchTerm != null && request.SearchType != null)
            {
                switch (request.SearchType)
                {
                    case ConsoleTableSearchType.GameTitle:
                        gameQuery = gameQuery.Where(x => x.Title.ToLower().Contains(request.SearchTerm.ToLower()));
                        break;
                    case ConsoleTableSearchType.GameGenre:
                        gameQuery = gameQuery.Where(x => x.GameGenre != null && x.GameGenre.ToLower().Contains(request.SearchTerm.ToLower()));
                        break;
                    case ConsoleTableSearchType.AchievementName:
                        gameQuery = gameQuery.Where(x => x.Achievements.Any(x => x.AchievementName.ToLower().Contains(request.SearchTerm.ToLower())));
                        break;
                    case ConsoleTableSearchType.AchievementDescription:
                        gameQuery = gameQuery.Where(x => x.Achievements.Any(x => x.AchievementDescription.ToLower().Contains(request.SearchTerm.ToLower())));
                        break;
                }
            }

            if (request.SortByName != null)
            {
                gameQuery = request.SortByName == true
                    ? gameQuery.OrderBy(x => x.Title)
                    : gameQuery.OrderByDescending(x => x.Title);
            }
            else if (request.SortByConsole != null)
            {
                gameQuery = request.SortByConsole == true
                    ? gameQuery.OrderBy(x => x.GameConsole.ConsoleName)
                    : gameQuery.OrderByDescending(x => x.GameConsole.ConsoleName);
            }
            else if (request.SortByPoints != null)
            {
                gameQuery = request.SortByPoints == true
                    ? gameQuery.OrderBy(x => x.Points)
                    : gameQuery.OrderByDescending(x => x.Points);
            }
            else if (request.SortByAchievementCount != null)
            {
                gameQuery = request.SortByAchievementCount == true
                    ? gameQuery.OrderBy(x => x.AchievementCount)
                    : gameQuery.OrderByDescending(x => x.AchievementCount);
            }
            else if (request.SortByPlayerCount != null)
            {
                gameQuery = request.SortByPlayerCount == true
                    ? gameQuery.OrderBy(x => x.Players)
                    : gameQuery.OrderByDescending(x => x.Players);
            }
            else if (request.SortByGenre != null)
            {
                gameQuery = request.SortByGenre == true
                    ? gameQuery.OrderBy(x => x.GameGenre)
                    : gameQuery.OrderByDescending(x => x.GameGenre);
            }

            var games = await gameQuery
                .Skip(request.Skip)
                .Take(request.Take)
                .Select(x => new ConsoleGames
                {
                    GameId = x.Id,
                    AchievementCount = x.AchievementCount,
                    GameGenre = x.GameGenre ?? "Not Set",
                    GameImageUrl = x.ImageIcon,
                    GameTitle = x.Title,
                    PlayerCount = x.Players ?? 0,
                    Points = x.Points,
                    ConsoleName = request.ConsoleId == -1 ? x.GameConsole.ConsoleName : null
                })
                .ToArrayAsync();

            var totalCount = await gameQuery.CountAsync();

            return new GetGamesForConsoleResponse
            {
                Games = games,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / request.Take),
                ConsoleName = request.ConsoleId == -1 ? "All Games" : context.GameConsoles.Where(x => x.ConsoleId == request.ConsoleId).Select(x => x.ConsoleName).FirstOrDefault() ?? "Unknown Console"
            };
        }

        public async Task<GetPublicSpecificGameInfoResponse?> GetPublicSpecificGameInfoResponse(int gameId)
        {
            var data = await raApiService.GetSpecificGameInfo(gameId);

            if (data == null)
            {
                return null;
            }

            return new GetPublicSpecificGameInfoResponse
            {
                GameId = data.Id,
                ImageBoxArt = data.ImageBoxArt,
                ImageTitle = data.ImageTitle,
                ImageInGame = data.ImageInGame,
                GameImage = data.ImageIcon,
                Publisher = data.Publisher,
                Developer = data.Developer,
                ConsoleId = data.ConsoleId,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                AchievementCount = data.AchievementCount,
                Players = data.Players,
                Title = data.Title,
                Achievements = data.Achievements == null ? [] : data.Achievements.OrderBy(x => x.Value.DisplayOrder).Select(x => new Achievement
                {
                    Id = x.Value.Id,
                    BadgeName = x.Value.BadgeName + ".png",
                    Description = x.Value.Description,
                    Points = x.Value.Points,
                    Title = x.Value.Title,
                    Type = x.Value.Type,
                }).ToList()
            };
        }

        public async Task<UserGameInfoDto?> GetUserGameInfo(int userId, int gameId)
        {
            var user = context.Users.Where(x => x.Id == userId).First();

            var data = await raApiService.GetSpecificGameInfoAndUserProgress(user.LoginUsername, user.RAUserUlid, gameId);
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
                    GameTracked = context.TrackedGames.Any(x => x.UserId == userId && x.Game.Id == gameId)
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
                GameTracked = context.TrackedGames.Any(x => x.UserId == userId && x.Game.Id == gameId)
            };
        }

        public async Task<UserAchievementsForGameDto> GetUserAchievementsForGame(int userId, int gameId)
        {
            var user = context.Users.Where(x => x.Id == userId).First();

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

        public async Task<GetUserProgressForConsoleResponse> GetUserProgressForConsole(int userId, GetUserProgressForConsoleRequest request)
        {
            var baseGames = context.Games
                .Where(x => x.HasAchievements
                            && (request.ConsoleId == -1 || x.ConsoleId == request.ConsoleId))
                .OrderBy(x => x.Id);

            var gameQuery = from g in baseGames
                        join ugp in context.UserGameProgress
                            .Where(ugp => ugp.UserId == userId)
                            on g.Id equals ugp.GameId into progGroup
                        from prog in progGroup.DefaultIfEmpty()
                        select new
                        {
                            Game = g,
                            Progress = prog,
                            AchievementsGained = prog != null ? prog.AchievementsGained : 0,
                            GamePercentage = prog != null ? prog.GamePercentage : 0
                        };

            if (request.HideInProgressGames == true)
            {
                gameQuery = gameQuery.Where(x => x.AchievementsGained == 0);
            }

            if (request.HideCompletedGames == true)
            {
                gameQuery = gameQuery.Where(x => x.GamePercentage != 100);
            }

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

            if (request.SortByPercentageComplete != null)
            {
                gameQuery = request.SortByPercentageComplete == true
                    ? gameQuery.OrderBy(x => x.GamePercentage)
                    : gameQuery.OrderByDescending(x => x.GamePercentage);
            }
            else if (request.SortByAchievementsUnlocked != null)
            {
                gameQuery = request.SortByAchievementsUnlocked == true
                    ? gameQuery.OrderBy(x => x.AchievementsGained)
                    : gameQuery.OrderByDescending(x => x.AchievementsGained);
            }
            else if (request.SortByName != null)
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
                    AchievementsUnlocked = x.AchievementsGained,
                    PercentageComplete = Math.Round(x.GamePercentage, 2),
                    GameGenre = x.Game.GameGenre ?? "Not Set",
                    GameImageUrl = x.Game.ImageIcon,
                    GameTitle = x.Game.Title,
                    PlayerCount = x.Game.Players ?? 0,
                    Points = x.Game.Points,
                    ConsoleName = request.ConsoleId == -1 ? x.Game.GameConsole.ConsoleName : null
                })
                .ToArrayAsync();

            var totalCount = await gameQuery.CountAsync();

            return new GetUserProgressForConsoleResponse
            {
                Games = games,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / request.Take),
                ConsoleName = request.ConsoleId == -1 ? "All Games" : context.GameConsoles.Where(x => x.ConsoleId == request.ConsoleId).Select(x => x.ConsoleName).FirstOrDefault() ?? "Unknown Console"
            };
        }

        public async Task<List<UserGamesTableDto>> GetInProgressGamesForUser(int userId)
        {
            var gameList = await context.UserGameProgress.Where(x => x.UserId == userId && x.GamePercentage != 100).ToListAsync();
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
                    gamePct = Math.Round(game.GamePercentage, 2);
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
