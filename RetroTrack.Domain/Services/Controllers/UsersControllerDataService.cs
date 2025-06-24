using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
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
    }
}
