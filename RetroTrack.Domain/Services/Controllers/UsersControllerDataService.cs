using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Users;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;
using Serilog;

namespace RetroTrack.Domain.Services.Controllers
{
    public class UsersControllerDataService(AppDbContext context, IRetroAchievementsSchedulerService raScheduler) : IUsersControllerDataService
    {
        public void DeleteUserSession(string sessionId)
        {
            context.Sessions.Where(x => x.SessionId == sessionId).ExecuteDelete();

            Log.Information($"[Logout User] Session {sessionId} deleted");
        }

        public UpdateUserGamesDto UpdateUserGames(string username)
        {
            var user = context.Users.Where(x => x.Username == username).First();
            var secondsDiff = (DateTime.UtcNow - user.LastUserUpdate).TotalSeconds;

            if (secondsDiff < 60)
            {
                return new UpdateUserGamesDto
                {
                    Success = false,
                    Reason = $"User update is on cooldown! You can next update in {60 - Math.Round(secondsDiff)} seconds time"
                };
            }

            raScheduler.QueueUserGameUpdate(username);

            user.LastUserUpdate = DateTime.UtcNow;
            context.SaveChanges();

            return new UpdateUserGamesDto
            {
                Success = true,
                Reason = "User games update queued",
            };
        }

        public bool CheckUserUpdateCompleted(string username)
        {
            var updateStatus = context.RetroAchievementsLogAndLoadData.Where(x => x.JsonData == username).OrderBy(x => x.Id).Last(x => x.JsonData == username);

            if (updateStatus.ProcessingStatus == ProcessingStatus.Processed)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
