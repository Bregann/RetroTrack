using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Navigation.Responses;
using RetroTrack.Domain.DTOs.Controllers.Users.Responses;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class UsersControllerDataService(AppDbContext context, IRetroAchievementsSchedulerService raScheduler) : IUsersControllerDataService
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
                // todo: get the data from the API instead
                throw new Exception("User not found");
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
                        .Where(x => x.HighestAwardKind == HighestAwardKind.Mastered)
                        .Select(x => new WallGame
                        {
                            GameId = x.GameId,
                            ConsoleName = x.Console.ConsoleName,
                            Title = x.Game.Title,
                            ImageUrl = x.Game.ImageIcon,
                            DateAchieved = x.HighestAwardDate ?? new DateTime(0),
                            IsHardcore = x.HighestAwardKind == HighestAwardKind.Mastered
                        })
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
                            IsHardcore = x.HighestAwardKind == HighestAwardKind.BeatenHardcore
                        })
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
    }
}
