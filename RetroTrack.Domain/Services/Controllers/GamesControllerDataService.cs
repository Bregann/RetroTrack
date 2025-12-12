using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Games.Requests;
using RetroTrack.Domain.DTOs.Controllers.Games.Responses;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Helpers;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;
using Serilog;
using Achievement = RetroTrack.Domain.DTOs.Controllers.Games.Responses.Achievement;
using UserAchievement = RetroTrack.Domain.DTOs.Controllers.Games.Responses.UserAchievement;

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

            var totalPoints = await gameQuery.SumAsync(x => x.Points);
            var totalAchievements = await gameQuery.SumAsync(x => x.AchievementCount);
            var totalPlayers = await gameQuery.SumAsync(x => x.Players ?? 0);
            var totalCount = await gameQuery.CountAsync();

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

            return new GetGamesForConsoleResponse
            {
                Games = games,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / request.Take),
                TotalPoints = totalPoints,
                TotalAchievements = totalAchievements,
                TotalPlayers = totalPlayers,
                ConsoleName = request.ConsoleId == -1 ? "All Games" : context.GameConsoles.Where(x => x.ConsoleId == request.ConsoleId).Select(x => x.ConsoleName).FirstOrDefault() ?? "Unknown Console"
            };
        }

        public async Task<GetPublicSpecificGameInfoResponse?> GetPublicSpecificGameInfo(int gameId)
        {
            //temp fix as the image data isnt in database yet
            var data = await raApiService.GetSpecificGameInfo(gameId, true, true);

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
                    AchievementOrder = x.Value.DisplayOrder
                }).ToList()
            };
        }

        public async Task<GetLoggedInSpecificGameInfoResponse?> GetLoggedInSpecificGameInfo(int userId, int gameId)
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

                achievementList.AddRange(loggedOutData.Achievements.OrderBy(x => x.Value.Id).Select(achievement => new UserAchievement
                {
                    BadgeName = "https://media.retroachievements.org/Badge/" + achievement.Value.BadgeName + ".png",
                    DateEarnedSoftcore = null,
                    Description = achievement.Value.Description,
                    Id = achievement.Value.Id,
                    Points = achievement.Value.Points,
                    Title = achievement.Value.Title,
                    Type = achievement.Value.Type,
                    DateEarnedHardcore = null,
                    AchievementOrder = achievement.Value.DisplayOrder
                }));

                return new GetLoggedInSpecificGameInfoResponse
                {
                    AchievementCount = loggedOutData.AchievementCount,
                    Achievements = achievementList,
                    ImageBoxArt = loggedOutData.ImageBoxArt,
                    ImageTitle = loggedOutData.ImageTitle,
                    ImageInGame = loggedOutData.ImageInGame,
                    ConsoleId = loggedOutData.ConsoleId,
                    ConsoleName = loggedOutData.ConsoleName,
                    GameId = gameId,
                    Genre = loggedOutData.Genre,
                    Players = loggedOutData.Players,
                    Title = loggedOutData.Title,
                    Developer = loggedOutData.Developer,
                    GameImage = loggedOutData.ImageIcon,
                    Publisher = loggedOutData.Publisher,
                    AchievementsAwardedHardcore = 0,
                    AchievementsAwardedSoftcore = 0,
                    AchievementsAwardedTotal = 0,
                    PointsAwardedHardcore = 0,
                    PointsAwardedSoftcore = 0,
                    PointsAwardedTotal = 0,
                    TotalGamePoints = loggedOutData.Achievements.Sum(x => x.Value.Points),
                    GameTracked = context.TrackedGames.Any(x => x.UserId == userId && x.GameId == gameId),
                    Playlists = await context.UserPlaylists
                        .Where(x => x.UserIdOwner == userId)
                        .Where(x => !context.UserPlaylistGames.Any(pg => pg.UserPlaylistId == x.Id && pg.GameId == gameId))
                        .Select(x => new DTOs.Controllers.Playlists.Responses.UserPlaylist
                        {
                            Id = x.Id,
                            Name = x.PlaylistName
                        }).ToArrayAsync()
                };
            }

            context.Games.First(x => x.Id == gameId).Players = data.Players;
            user.LastAchievementsUpdate = DateTime.UtcNow;
            await context.SaveChangesAsync();

            foreach (var achievement in data.Achievements.OrderBy(x => x.Value.Id))
            {
                achievementList.Add(new UserAchievement
                {
                    Id = achievement.Value.Id,
                    BadgeName = (achievement.Value.DateEarned != null ? achievement.Value.BadgeName : achievement.Value.BadgeName + "_lock") + ".png",
                    Description = achievement.Value.Description,
                    Points = achievement.Value.Points,
                    Title = achievement.Value.Title,
                    DateEarnedSoftcore = DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarned),
                    DateEarnedHardcore = achievement.Value.DateEarnedHardcore != null ? DateTimeHelper.HumanizeDateTimeWithTime(achievement.Value.DateEarnedHardcore) : null,
                    Type = achievement.Value.Type,
                    AchievementOrder = achievement.Value.DisplayOrder
                });
            }

            // games can have multiple win condition achievements, so we need to check if any of them are completed
            var winConditionAchievement = data.Achievements
                .Where(x => x.Value.Type == AchievementType.Win_Condition)
                .ToList();

            string? gameBeatenDateSoftcore = null;
            string? gameBeatenDateHardcore = null;

            if (winConditionAchievement.Count != 0)
            {
                gameBeatenDateSoftcore = DateTimeHelper.HumanizeDateTimeWithTime(winConditionAchievement
                    .Where(x => x.Value.DateEarned != null)
                    .Select(x => x.Value.DateEarned)
                    .FirstOrDefault());

                gameBeatenDateHardcore = DateTimeHelper.HumanizeDateTimeWithTime(winConditionAchievement
                    .Where(x => x.Value.DateEarnedHardcore != null)
                    .Select(x => x.Value.DateEarnedHardcore)
                    .FirstOrDefault());
            }

            string? gameCompletedDate = null;
            string? gameMasteredDate = null;

            if (data.NumAwardedToUser == data.AchievementCount)
            {
                var lastAchievement = data.Achievements
                    .OrderByDescending(x => x.Value.DateEarned)
                    .FirstOrDefault();

                gameCompletedDate = DateTimeHelper.HumanizeDateTimeWithTime(lastAchievement.Value.DateEarned);

                var lastAchievementHardcore = data.Achievements
                    .OrderByDescending(x => x.Value.DateEarnedHardcore)
                    .FirstOrDefault();

                gameMasteredDate = DateTimeHelper.HumanizeDateTimeWithTime(lastAchievement.Value.DateEarnedHardcore);
            }

            return new GetLoggedInSpecificGameInfoResponse
            {
                GameId = data.Id,
                ImageBoxArt = data.ImageBoxArt,
                ImageTitle = data.ImageTitle,
                ImageInGame = data.ImageInGame,
                ConsoleId = data.ConsoleId,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                AchievementCount = data.AchievementCount,
                Players = data.Players,
                Title = data.Title,
                Achievements = achievementList,
                Developer = data.Developer,
                Publisher = data.Publisher,
                GameImage = data.ImageIcon,
                AchievementsAwardedSoftcore = data.Achievements.Where(x => x.Value.DateEarned != null).Count(),
                AchievementsAwardedHardcore = data.Achievements.Where(x => x.Value.DateEarnedHardcore != null).Count(),
                AchievementsAwardedTotal = data.Achievements.Where(x => x.Value.DateEarned != null).Count(),
                PointsAwardedSoftcore = data.Achievements.Where(x => x.Value.DateEarned != null).Sum(x => x.Value.Points),
                PointsAwardedHardcore = data.Achievements.Where(x => x.Value.DateEarnedHardcore != null).Sum(x => x.Value.Points),
                PointsAwardedTotal = data.Achievements.Where(x => x.Value.DateEarned != null).Sum(x => x.Value.Points),
                TotalGamePoints = data.Achievements.Sum(x => x.Value.Points),
                DateBeatenSoftcore = gameBeatenDateSoftcore,
                DateBeatenHardcore = gameBeatenDateHardcore,
                DateCompleted = gameCompletedDate,
                DateMastered = gameMasteredDate,
                GameTracked = context.TrackedGames.Any(x => x.UserId == userId && x.GameId == gameId),
                UserNotes = context.UserGameNotes.Where(x => x.UserId == userId && x.GameId == gameId).Select(x => x.Notes).FirstOrDefault(),
                Playlists = await context.UserPlaylists
                    .Where(x => x.UserIdOwner == userId)
                    .Where(x => !context.UserPlaylistGames.Any(pg => pg.UserPlaylistId == x.Id && pg.GameId == gameId))
                    .Select(x => new DTOs.Controllers.Playlists.Responses.UserPlaylist
                    {
                        Id = x.Id,
                        Name = x.PlaylistName
                    }).ToArrayAsync()
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
                                GamePercentage = prog != null ? prog.GamePercentage : 0,
                                HighestAward = prog.HighestAwardKind
                            };

            if (request.HideInProgressGames == true)
            {
                gameQuery = gameQuery.Where(x => x.AchievementsGained == 0 || x.HighestAward != null);
            }

            if (request.HideUnstartedGames == true)
            {
                gameQuery = gameQuery.Where(x => x.AchievementsGained > 0 || x.HighestAward != null);
            }

            if (request.HideBeatenGames == true)
            {
                gameQuery = gameQuery.Where(x => x.HighestAward != HighestAwardKind.BeatenSoftcore && x.HighestAward != HighestAwardKind.BeatenHardcore);
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
                    ConsoleName = request.ConsoleId == -1 ? x.Game.GameConsole.ConsoleName : null,
                    HighestAward = x.HighestAward
                })
                .ToArrayAsync();

            var totalCount = await gameQuery.CountAsync();
            var totalPointsToEarn = await baseGames.SumAsync(x => x.Points);
            var totalAchievementsToEarn = await baseGames.SumAsync(x => x.AchievementCount);

            var userGameProgressQuery = context.UserGameProgress
                .Where(x => x.UserId == userId && (request.ConsoleId == -1 || x.ConsoleId == request.ConsoleId));

            var totalAchievementsEarnedSoftcore = await userGameProgressQuery.SumAsync(x => x.AchievementsGained);
            var totalAchievementsEarnedHardcore = await userGameProgressQuery.SumAsync(x => x.AchievementsGainedHardcore);

            var totalGamesBeatenSoftcore = await userGameProgressQuery.Where(x => x.HighestAwardKind == HighestAwardKind.BeatenSoftcore || x.HighestAwardKind == HighestAwardKind.Completed).CountAsync();
            var totalGamesBeatenHardcore = await userGameProgressQuery.Where(x => x.HighestAwardKind == HighestAwardKind.BeatenHardcore || x.HighestAwardKind == HighestAwardKind.Mastered).CountAsync();
            var totalGamesCompletedSoftcore = await userGameProgressQuery.Where(x => x.HighestAwardKind == HighestAwardKind.Completed).CountAsync();
            var totalGamesMasteredHardcore = await userGameProgressQuery.Where(x => x.HighestAwardKind == HighestAwardKind.Mastered).CountAsync();

            return new GetUserProgressForConsoleResponse
            {
                Games = games,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / request.Take),
                TotalPointsToEarn = totalPointsToEarn,
                TotalAchievementsToEarn = totalAchievementsToEarn,
                TotalAchievementsEarnedSoftcore = totalAchievementsEarnedSoftcore,
                TotalAchievementsEarnedHardcore = totalAchievementsEarnedHardcore,
                TotalGamesBeatenSoftcore = totalGamesBeatenSoftcore,
                TotalGamesBeatenHardcore = totalGamesBeatenHardcore,
                TotalGamesCompletedSoftcore = totalGamesCompletedSoftcore,
                TotalGamesMasteredHardcore = totalGamesMasteredHardcore,
                ConsoleName = request.ConsoleId == -1 ? "All Games" : context.GameConsoles.Where(x => x.ConsoleId == request.ConsoleId).Select(x => x.ConsoleName).FirstOrDefault() ?? "Unknown Console"
            };
        }

        public async Task<GetLeaderboardsFromGameIdResponse?> GetLeaderboardsFromGameId(int gameId)
        {
            // check if the game has achievements first
            var game = await context.Games.FirstOrDefaultAsync(x => x.Id == gameId && x.HasAchievements);

            if (game == null)
            {
                Log.Information($"Game {gameId} does not have achievements, skipping leaderboard fetch");
                return null;
            }

            // get the first 500 leaderboards
            var leaderboards = await raApiService.GetGameLeaderboards(gameId);

            if (leaderboards == null)
            {
                return null;
            }

            // if there's more than 500 leaderboards, we need to get the rest and add them to the list
            if (leaderboards.Total > 500)
            {
                int skipAmount = 500;
                while (skipAmount < leaderboards.Total)
                {
                    var moreLeaderboards = await raApiService.GetGameLeaderboards(gameId, skipAmount);

                    if (moreLeaderboards != null)
                    {
                        leaderboards.Results.AddRange(moreLeaderboards.Results);
                    }

                    skipAmount += 500;
                }
            }

            return new GetLeaderboardsFromGameIdResponse
            {
                TotalLeaderboards = leaderboards.Total,
                Leaderboards = leaderboards.Results.OrderBy(x => x.RankAsc).Select((x, index) => new LeaderboardDetails
                {
                    LeaderboardId = x.Id,
                    Rank = index + 1,
                    Title = x.Title,
                    Description = x.Description,
                    Author = x.Author,
                    TopUser = x.TopEntry.User ?? "N/A",
                    TopScore = x.TopEntry.FormattedScore ?? "N/A"
                }).ToArray()
            };
        }

        public async Task UpdateUserNotes(int userId, int gameId, string notes)
        {
            var existingNotes = await context.UserGameNotes.FirstOrDefaultAsync(x => x.UserId == userId && x.GameId == gameId);

            if (existingNotes != null)
            {
                existingNotes.Notes = notes;
            }
            else
            {
                await context.UserGameNotes.AddAsync(new UserGameNote
                {
                    UserId = userId,
                    GameId = gameId,
                    Notes = notes
                });
            }

            await context.SaveChangesAsync();
        }
    }
}
