using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Controllers.Users;
using RetroTrack.Domain.DTOs.Helpers;
using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class UsersControllerDataService(AppDbContext context, IRetroAchievementsSchedulerService raScheduler) : IUsersControllerDataService
    {
        public async Task<UpdateUserGamesDto> UpdateUserGames(UserDataDto userData)
        {
            var user = await context.Users.Where(x => x.Id == userData.UserId).FirstAsync();
            var secondsDiff = (DateTime.UtcNow - user.LastUserUpdate).TotalSeconds;

            if (secondsDiff < 60)
            {
                return new UpdateUserGamesDto
                {
                    Success = false,
                    Reason = $"User update is on cooldown! You can next update in {60 - Math.Round(secondsDiff)} seconds time"
                };
            }

            await raScheduler.QueueUserGameUpdate(user.LoginUsername, user.Id);

            user.LastUserUpdate = DateTime.UtcNow;
            await context.SaveChangesAsync();

            return new UpdateUserGamesDto
            {
                Success = true,
                Reason = "User games update queued",
            };
        }

        public async Task<bool> CheckUserUpdateCompleted(UserDataDto userData)
        {
            var updateStatus = await context.RetroAchievementsLogAndLoadData.Where(x => x.JsonData == userData.UserId.ToString()).OrderBy(x => x.Id).LastAsync(x => x.JsonData == userData.UserId.ToString());

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
