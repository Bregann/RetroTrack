using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Enums;
using Serilog;

namespace RetroTrack.Domain.OldCode
{
    public class RetroAchievements
    {
        public static async Task GetUserGames(string username, int updateId)
        {


            using (var context = new DatabaseContext())
            {
                var user = context.Users.Where(x => x.Username == username).First();
                var userProfile = await GetUserProfile(username);

                if (userProfile != null)
                {
                    user.UserProfileUrl = "/UserPic/" + userProfile.User + ".png";
                    user.UserRank = userProfile.Rank ?? 0;
                    user.UserPoints = userProfile.TotalPoints;
                }

                foreach (var game in gameList)
                {
                    var gameData = await context.UserGameProgress.FirstOrDefaultAsync(x => x.GameId == game.GameId);

                    if (gameData != null)
                    {
                        gameData.AchievementsGained = game.NumAwarded;
                        gameData.AchievementsGainedHardcore = game.NumAwardedHardcore;
                        gameData.GamePercentage = (double)game.NumAwarded / game.MaxPossible * 100;
                        gameData.GamePercentageHardcore = (double)game.NumAwardedHardcore / game.MaxPossible * 100;
                        gameData.HighestAwardKind = RAHelper.ConvertHighestAwardKind(game.HighestAwardKind);
                        gameData.HighestAwardDate = game.HighestAwardDate.HasValue ? game.HighestAwardDate.Value.UtcDateTime : null;
                        gameData.ConsoleId = game.ConsoleId;
                        continue;
                    }
                    else
                    {
                        // Check if the game is actually in the system yet
                        if (!await context.Games.AnyAsync(x => x.Id == game.GameId))
                        {
                            Log.Information($"[User Update] Game {game.GameId} not found in database");
                            continue;
                        }

                        await context.UserGameProgress.AddAsync(new UserGameProgress
                        {
                            AchievementsGained = game.NumAwarded,
                            AchievementsGainedHardcore = game.NumAwardedHardcore,
                            GameId = game.GameId,
                            ConsoleId = game.ConsoleId,
                            GamePercentage = (double)game.NumAwarded / game.MaxPossible * 100,
                            GamePercentageHardcore = (double)game.NumAwardedHardcore / game.MaxPossible * 100,
                            Username = username,
                            HighestAwardDate = game.HighestAwardDate.HasValue ? game.HighestAwardDate.Value.UtcDateTime : null,
                            HighestAwardKind = RAHelper.ConvertHighestAwardKind(game.HighestAwardKind)
                        });
                    }
                }

                context.RetroAchievementsApiData.Where(x => x.Id == updateId).First().ProcessingStatus = ProcessingStatus.Processed;
                await context.SaveChangesAsync();

                Log.Information($"[RetroAchievements] Game progress updated for {username}");
            }

            stopwatch.Stop();
            Console.WriteLine(stopwatch.Elapsed);
        }
            catch (Exception e)
            {
                using (var context = new DatabaseContext())
                {
                    var erroredData = context.RetroAchievementsApiData.First(x => x.Id == updateId);

                    //Check if it's already failed 3 times, if it has then set it to errrored
                    if (erroredData.FailedProcessingAttempts == 3)
                    {
                        erroredData.ProcessingStatus = ProcessingStatus.Errored;
                        //todo: send message on error
                    }
                    else
                    {
                        erroredData.ProcessingStatus = ProcessingStatus.NotScheduled;
                        erroredData.FailedProcessingAttempts = erroredData.FailedProcessingAttempts + 1;
                    }

context.SaveChanges();
                }

                Log.Fatal($"[RetroAchievements] Error updating user {username} - reason {e.Message}");
return;
            }
        }


    }
}