using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Controllers.Navigation.Responses;
using RetroTrack.Domain.DTOs.Controllers.Users.Requests;
using RetroTrack.Domain.DTOs.Controllers.Users.Responses;
using RetroTrack.Domain.DTOs.RetroAchievementsApi;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Exceptions;
using RetroTrack.Domain.Helpers;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;
using Serilog;
using System.Text.Json;

namespace RetroTrack.Domain.Services.Controllers
{
    public class UsersControllerDataService(AppDbContext context, IRetroAchievementsSchedulerService raScheduler, IRetroAchievementsApiService raApiService, ICachingService cachingService) : IUsersControllerDataService
    {
        public async Task<RequestUserGameUpdateResponse> RequestUserGameUpdate(int userId)
        {
            var user = await context.Users.Where(x => x.Id == userId).FirstAsync();
            var secondsDiff = (DateTime.UtcNow - user.LastUserUpdate).TotalSeconds;

            if (secondsDiff < 60)
            {
                return new RequestUserGameUpdateResponse
                {
                    Success = false,
                    Reason = $"User update is on cooldown! You can next update in {60 - Math.Round(secondsDiff)} seconds time"
                };
            }

            await raScheduler.QueueUserGameUpdate(user.LoginUsername, user.Id);

            user.LastUserUpdate = DateTime.UtcNow;
            await context.SaveChangesAsync();

            return new RequestUserGameUpdateResponse
            {
                Success = true,
                Reason = "User games update queued",
            };
        }

        public async Task<bool> CheckUserUpdateCompleted(int userId)
        {
            var updateStatus = await context.RetroAchievementsLogAndLoadData.Where(x => x.JsonData == userId.ToString()).OrderBy(x => x.Id).LastAsync(x => x.JsonData == userId.ToString());

            if (updateStatus.ProcessingStatus == ProcessingStatus.Processed)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<GetUserProfileResponse> GetUserProfile(string username)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.LoginUsername == username || x.RAUsername.ToLower() == username);

            if (user == null)
            {
                // check if they're in the cache as this gets heavily cached when they aren't registered users
                // this is to avoid hitting the api too much

                var cachedUser = await cachingService.GetCacheItem($"raProfile_{username.ToLower()}");

                if (cachedUser != null)
                {
                    Log.Information($"[RetroAchievements] User {username} found in cache, returning cached data.");
                    var cachedData = JsonSerializer.Deserialize<GetUserProfileResponse>(cachedUser);

                    if (cachedData == null)
                    {
                        Log.Error($"[RetroAchievements] Cached data for user {username} is null.");
                        throw new InvalidOperationException("Error loading profile from cache.");
                    }

                    return cachedData;
                }

                // if they aren't found then get the data from the ra api
                var raUserProfile = await raApiService.GetUserProfileFromUsername(username);

                if (raUserProfile == null)
                {
                    throw new KeyNotFoundException("User not found");
                }

                // get all their game progress
                var userGameProgress = await raApiService.GetUserCompletionProgress(raUserProfile.User, raUserProfile.Ulid);

                if (userGameProgress == null)
                {
                    throw new RetroAchievementsApiException("Failed to fetch user game progress from RetroAchievements API");
                }

                // add the game progress into a new variable and keep calling the api till all data is fetched
                var allUserGameProgress = new List<Result>();
                allUserGameProgress.AddRange(userGameProgress.Results);

                if (userGameProgress.Total > 500)
                {
                    Log.Information($"[RetroAchievements] User {raUserProfile.User} has more than 500 games, processing additional data in batches.");
                    var timesToProcess = Math.Ceiling((decimal)userGameProgress.Total / 500) - 1;
                    var skip = 500;

                    for (int i = 0; i < timesToProcess; i++)
                    {
                        var extraData = await raApiService.GetUserCompletionProgress(raUserProfile.User, raUserProfile.Ulid, skip);

                        if (extraData == null || extraData.Results == null)
                        {
                            Log.Error($"[RetroAchievements] Failed to fetch additional user game progress for {raUserProfile.User} at skip {skip}");
                            throw new RetroAchievementsApiException("Failed to extra fetch user game progress from RetroAchievements API");
                        }

                        allUserGameProgress.AddRange(extraData.Results);
                        skip += 500;
                        await Task.Delay(1000); // Delay to avoid hitting API rate limits
                    }
                }

                Log.Information($"[RetroAchievements] Fetched {allUserGameProgress.Count} games for user {raUserProfile.User}");

                // get the console progress data
                var consoleProgressData = allUserGameProgress
                    .GroupBy(x => x.ConsoleId)
                    .Select(group => new ConsoleProgressData
                    {
                        ConsoleId = group.Key,
                        ConsoleName = group.First().ConsoleName,
                        ConsoleType = context.GameConsoles.First(x => x.ConsoleId == group.Key).ConsoleType,
                        TotalGamesInConsole = group.Count(),
                        GamesBeatenHardcore = group.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.BeatenHardcore || RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Mastered),
                        GamesBeatenSoftcore = group.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.BeatenSoftcore || RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Completed),
                        GamesMastered = group.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Mastered),
                        GamesCompleted = group.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Completed),
                        PercentageBeatenSoftcore = group.Count() != 0 ? Math.Round((double)group.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) != HighestAwardKind.BeatenSoftcore) / group.Count() * 100, 2) : 0,
                        PercentageBeatenHardcore = group.Count() != 0 ? Math.Round((double)group.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) != HighestAwardKind.BeatenHardcore) / group.Count() * 100, 2) : 0,
                        PercentageCompleted = group.Count() != 0 ? Math.Round((double)group.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Completed) / group.Count() * 100, 2) : 0,
                        PercentageMastered = group.Count() != 0 ? Math.Round((double)group.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Mastered) / group.Count() * 100, 2) : 0
                    })
                    .OrderBy(x => x.ConsoleName)
                    .ToArray();

                // create the dto to return
                var data = new GetUserProfileResponse
                {
                    AchievementsEarnedHardcore = allUserGameProgress.Sum(x => x.NumAwardedHardcore),
                    AchievementsEarnedSoftcore = allUserGameProgress.Sum(x => x.NumAwarded),
                    ConsoleProgressData = consoleProgressData,
                    GamesBeatenHardcore = allUserGameProgress.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.BeatenHardcore),
                    GamesBeatenSoftcore = allUserGameProgress.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.BeatenSoftcore),
                    GamesCompleted = allUserGameProgress.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Completed),
                    GamesInProgress = allUserGameProgress.Count(x => x.HighestAwardKind == null),
                    GamesMastered = allUserGameProgress.Count(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Mastered),
                    GamesMasteredWall = allUserGameProgress
                        .Where(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Mastered)
                        .Select(x => new WallGame
                        {
                            GameId = x.GameId,
                            ConsoleName = x.ConsoleName,
                            Title = x.Title,
                            ImageUrl = x.ImageIcon,
                            DateAchieved = x.HighestAwardDate.HasValue ? x.HighestAwardDate.Value.UtcDateTime : new DateTime(0),
                            IsHardcore = RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.Mastered,
                            WallPosition = -1
                        })
                        .ToArray(),
                    Last5Awards = allUserGameProgress
                        .OrderByDescending(x => x.HighestAwardDate)
                        .Take(5)
                        .Select(x => new Last5GameInfo
                        {
                            GameId = x.GameId,
                            Title = x.Title,
                            ImageUrl = x.ImageIcon,
                            DatePlayed = x.HighestAwardDate.HasValue ? x.HighestAwardDate.Value.UtcDateTime : new DateTime(0),
                            AchievementsUnlockedHardcore = x.NumAwardedHardcore,
                            AchievementsUnlockedSoftcore = x.NumAwarded,
                            TotalGameAchievements = x.MaxPossible,
                            TotalGamePoints = context.Games.First(g => g.Id == x.GameId).Points,
                            HighestAward = RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind)
                        })
                        .ToArray(),
                    GamesBeatenWall = allUserGameProgress
                        .Where(x => RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.BeatenSoftcore || RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.BeatenHardcore)
                        .Select(x => new WallGame
                        {
                            GameId = x.GameId,
                            ConsoleName = x.ConsoleName,
                            Title = x.Title,
                            ImageUrl = x.ImageIcon,
                            DateAchieved = x.HighestAwardDate.HasValue ? x.HighestAwardDate.Value.UtcDateTime : new DateTime(0),
                            IsHardcore = RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind) == HighestAwardKind.BeatenHardcore,
                            WallPosition = -1
                        })
                        .ToArray(),
                    HardcorePoints = raUserProfile.TotalPoints,
                    SoftcorePoints = raUserProfile.TotalSoftcorePoints,
                    LastUserUpdate = DateTime.UtcNow,
                    Last5GamesPlayed = allUserGameProgress
                        .OrderByDescending(x => x.MostRecentAwardedDate)
                        .Take(5)
                        .Select(x => new Last5GameInfo
                        {
                            GameId = x.GameId,
                            Title = x.Title,
                            ImageUrl = x.ImageIcon,
                            DatePlayed = x.MostRecentAwardedDate.HasValue ? x.MostRecentAwardedDate.Value.UtcDateTime : DateTime.MinValue,
                            AchievementsUnlockedHardcore = x.NumAwardedHardcore,
                            AchievementsUnlockedSoftcore = x.NumAwarded,
                            TotalGameAchievements = x.MaxPossible,
                            TotalGamePoints = context.Games.First(g => g.Id == x.GameId).Points,
                            HighestAward = RetroAchievementsHelper.ConvertHighestAwardKind(x.HighestAwardKind)
                        })
                        .ToArray(),
                    RaUsername = raUserProfile.User,
                };

                // cache the data for 30 minutes
                var cacheData = JsonSerializer.Serialize(data);
                await cachingService.AddOrUpdateCacheItem($"raProfile_{username.ToLower()}", cacheData, 30);

                return data;
            }
            else
            {
                var userGameProgress = await context.UserGameProgress.Where(x => x.UserId == user.Id).ToArrayAsync();

                // Fetch user data from the database
                var query = from gc in context.GameConsoles.Where(x => x.DisplayOnSite)
                            join ugp in context.UserGameProgress.Where(x => x.UserId == user.Id)
                                on gc.ConsoleId equals ugp.ConsoleId into grouping
                            select new ConsoleProgressData
                            {
                                ConsoleId = gc.ConsoleId,
                                ConsoleName = gc.ConsoleName,
                                ConsoleType = gc.ConsoleType,
                                TotalGamesInConsole = gc.GameCount,
                                GamesBeatenHardcore = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.BeatenHardcore || x.HighestAwardKind == HighestAwardKind.Mastered),
                                GamesBeatenSoftcore = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.BeatenSoftcore || x.HighestAwardKind == HighestAwardKind.Completed),
                                GamesMastered = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Mastered),
                                GamesCompleted = grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Completed),
                                PercentageBeatenSoftcore = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind != HighestAwardKind.BeatenSoftcore) / gc.GameCount * 100, 2) : 0,
                                PercentageBeatenHardcore = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind != HighestAwardKind.BeatenHardcore) / gc.GameCount * 100, 2) : 0,
                                PercentageCompleted = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Completed) / gc.GameCount * 100, 2) : 0,
                                PercentageMastered = gc.GameCount != 0 ? Math.Round((double)grouping.Count(x => x.HighestAwardKind == HighestAwardKind.Mastered) / gc.GameCount * 100, 2) : 0
                            };

                var consoleProgressData = await query.OrderBy(x => x.ConsoleName).ToArrayAsync();

                var data = new GetUserProfileResponse
                {
                    RaUsername = user.RAUsername,
                    LastUserUpdate = user.LastUserUpdate,
                    SoftcorePoints = user.UserPointsSoftcore,
                    HardcorePoints = user.UserPointsHardcore,
                    GamesBeatenSoftcore = userGameProgress.Where(x => x.HighestAwardKind == HighestAwardKind.BeatenSoftcore).Count(),
                    GamesBeatenHardcore = userGameProgress.Where(x => x.HighestAwardKind == HighestAwardKind.BeatenHardcore).Count(),
                    GamesCompleted = userGameProgress.Where(x => x.HighestAwardKind == HighestAwardKind.Completed).Count(),
                    GamesMastered = userGameProgress.Where(x => x.HighestAwardKind == HighestAwardKind.Mastered).Count(),
                    AchievementsEarnedSoftcore = userGameProgress.Sum(x => x.AchievementsGained),
                    AchievementsEarnedHardcore = userGameProgress.Sum(x => x.AchievementsGainedHardcore),
                    GamesInProgress = userGameProgress.Where(x => x.HighestAwardKind == null).Count(),
                    GamesMasteredWall = userGameProgress
                        .Where(x => x.HighestAwardKind == HighestAwardKind.Mastered || x.HighestAwardKind == HighestAwardKind.Completed)
                        .Select(x => new WallGame
                        {
                            GameId = x.GameId,
                            ConsoleName = x.Console.ConsoleName,
                            Title = x.Game.Title,
                            ImageUrl = x.Game.ImageIcon,
                            DateAchieved = x.HighestAwardDate ?? new DateTime(0),
                            IsHardcore = x.HighestAwardKind == HighestAwardKind.Mastered,
                            WallPosition = x.WallPosition,
                            ProgressId = x.Id
                        })
                        .OrderBy(x => x.WallPosition == -1 ? int.MaxValue : x.WallPosition)
                        .ToArray(),
                    GamesBeatenWall = userGameProgress
                        .Where(x => x.HighestAwardKind == HighestAwardKind.BeatenSoftcore || x.HighestAwardKind == HighestAwardKind.BeatenHardcore)
                        .Select(x => new WallGame
                        {
                            GameId = x.GameId,
                            ConsoleName = x.Console.ConsoleName,
                            Title = x.Game.Title,
                            ImageUrl = x.Game.ImageIcon,
                            DateAchieved = x.HighestAwardDate ?? new DateTime(0),
                            IsHardcore = x.HighestAwardKind == HighestAwardKind.BeatenHardcore,
                            WallPosition = x.WallPosition,
                            ProgressId = x.Id
                        })
                        .OrderBy(x => x.WallPosition == -1 ? int.MaxValue : x.WallPosition)
                        .ToArray(),
                    Last5Awards = userGameProgress
                        .OrderByDescending(x => x.HighestAwardDate)
                        .Take(5)
                        .Select(x => new Last5GameInfo
                        {
                            GameId = x.GameId,
                            Title = x.Game.Title,
                            ImageUrl = x.Game.ImageIcon,
                            DatePlayed = x.HighestAwardDate ?? new DateTime(0),
                            AchievementsUnlockedHardcore = x.AchievementsGainedHardcore,
                            AchievementsUnlockedSoftcore = x.AchievementsGained,
                            TotalGameAchievements = x.Game.AchievementCount,
                            TotalGamePoints = x.Game.Points,
                            HighestAward = x.HighestAwardKind
                        })
                        .ToArray(),
                    Last5GamesPlayed = userGameProgress
                        .OrderByDescending(x => x.MostRecentAwardedDate)
                        .Take(5)
                        .Select(x => new Last5GameInfo
                        {
                            GameId = x.GameId,
                            Title = x.Game.Title,
                            ImageUrl = x.Game.ImageIcon,
                            DatePlayed = x.MostRecentAwardedDate ?? new DateTime(0),
                            AchievementsUnlockedHardcore = x.AchievementsGainedHardcore,
                            AchievementsUnlockedSoftcore = x.AchievementsGained,
                            TotalGameAchievements = x.Game.AchievementCount,
                            TotalGamePoints = x.Game.Points,
                            HighestAward = x.HighestAwardKind
                        })
                        .ToArray(),
                    ConsoleProgressData = consoleProgressData
                };

                return data;
            }
        }

        public async Task SaveUserGameWallPositions(int userId, SaveUserGameWallPositionsRequest request)
        {
            foreach (var game in request.WallData)
            {
                await context.UserGameProgress
                    .Where(x => x.Id == game.ProgressId)
                    .ExecuteUpdateAsync(setters =>
                        setters.SetProperty(x => x.WallPosition, game.WallPosition));
            }

            Log.Information($"Saved wall positions for user {userId}");
        }
    }
}