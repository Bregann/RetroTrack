﻿using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Enums;
using RetroTrack.Infrastructure.Database.Models;
using Serilog;

namespace RetroTrack.Domain.Data
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

        public static UpdateUserGamesDto UpdateUserGames(string username)
        {
            using (var context = new DatabaseContext())
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

                context.RetroAchievementsApiData.Add(new RetroAchievementsApiData
                {
                    ApiRequestType = ApiRequestType.UserUpdate,
                    JsonData = username,
                    FailedProcessingAttempts = 0,
                    ProcessingStatus = ProcessingStatus.NotScheduled,
                    LastUpdate = DateTime.UtcNow
                });

                user.LastUserUpdate = DateTime.UtcNow;
                context.SaveChanges();

                return new UpdateUserGamesDto
                {
                    Success = true,
                    Reason = "User games update queued",
                };
            }
        }

        public static bool CheckUserUpdateCompleted(string username)
        {
            using (var context = new DatabaseContext())
            {
                var updateStatus = context.RetroAchievementsApiData.Where(x => x.JsonData == username).OrderBy(x => x.Id).Last(x => x.JsonData == username);

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
}