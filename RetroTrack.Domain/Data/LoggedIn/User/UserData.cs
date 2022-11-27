using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Data.LoggedIn.UserData
{
    public class UserData
    {
        public static void DeleteUserSession(string sessionId)
        {
            using (var context = new DatabaseContext())
            {
                context.Sessions.Where(x => x.SessionId == sessionId).ExecuteDelete();
                context.SaveChanges();

                Log.Information($"[Logout User] Session {sessionId} deleted");
            }
        }

        public static async Task<UpdateUserGamesDto> UpdateUserGames(string username)
        {
            using (var context = new DatabaseContext())
            {
                var user = context.Users.Where(x => x.Username == username).First();
                var secondsDiff = (DateTime.UtcNow - user.LastUserUpdate).TotalSeconds;

                if (secondsDiff < 30)
                {
                    return new UpdateUserGamesDto
                    {
                        Success = false,
                        Reason = $"User update is on cooldown! You can next update in {secondsDiff} seconds time"
                    };
                }

               await RetroAchievements.GetUserGames(username);

                return new UpdateUserGamesDto 
                { 
                    Success = true, 
                    Reason = "User games updated" 
                };
            }
        }
    }
}
