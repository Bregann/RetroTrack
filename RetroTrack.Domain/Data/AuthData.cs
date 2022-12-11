using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using RestSharp;
using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Models;
using Serilog;
using System.Net;

namespace RetroTrack.Domain.Data
{
    public class AuthData
    {
        public static LoginUserDto ValidateUserLogin(string username, string password)
        {
            using (var context = new DatabaseContext())
            {
                //Get the user
                var user = context.Users.FirstOrDefault(x => x.Username == username);

                if (user == null)
                {
                    Log.Information($"[User Login] Attempted login with username {username} failed due to user not existing");

                    return new LoginUserDto
                    {
                        Successful = false
                    };
                }

                //Validate if the password is correct
                var isMatch = BCrypt.Net.BCrypt.Verify(password, user.HashedPassword);

                if (!isMatch)
                {
                    Log.Information($"[User Login] Attempted login with username {username} failed due to incorrect password");

                    return new LoginUserDto
                    {
                        Successful = false
                    };
                }

                var sessionId = $"D{DateTime.UtcNow.Ticks / 730}G{Guid.NewGuid()}";

                //Create a new session id and add it into the database
                context.Sessions.Add(new Sessions
                {
                    SessionId = sessionId,
                    User = user
                });

                context.SaveChanges();
                Log.Information($"[User Login] Attempted login with username {username} successful");

                return new LoginUserDto
                {
                    Successful = true,
                    SessionId = sessionId,
                    Username = username
                };
            }
        }

        public static async Task<RegisterUserDto> RegisterUser(string username, string password, string raApiKey)
        {
            //Validate the API key to make sure that it's the correct username/api key combo
            var validKey = await RetroAchievements.ValidateApiKey(username, raApiKey);

            if (!validKey)
            {
                return new RegisterUserDto
                {
                    Successful = false,
                    Reason = "Error validating API key. Please double check your username and RetroAchievements API key and try again"
                };
            }

            using (var context = new DatabaseContext())
            {
                var trackedGames = context.Users.Where(x => x.Username == username).Select(x => x.TrackedGames);

                //Check if the user is actually registered
                if (context.Users.Any(x => x.Username == username.ToLower()))
                {
                    Log.Information($"[Register User] User {username} already exists");

                    return new RegisterUserDto
                    {
                        Successful = false,
                        Reason = "User already registered. Forgot your password? Use the forgot password link on the login form"
                    };
                }

                //hash the password and store it
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

                //Get the users details from the API
                var userProfile = await RetroAchievements.GetUserProfile(username);

                //Add the user into the database
                context.Users.Add(new Users
                {
                    Username = username,
                    HashedPassword = hashedPassword,
                    LastActivity = DateTime.UtcNow,
                    LastUserUpdate = DateTime.UtcNow,
                    LastAchievementsUpdate = DateTime.UtcNow,
                    UserPoints = userProfile.TotalPoints,
                    UserProfileUrl = userProfile.UserPic,
                    UserRank = userProfile.Rank
                });

                context.SaveChanges();

                Log.Information($"[Register User] {username} succesfully registered");

                return new RegisterUserDto
                {
                    Successful = true,
                    Reason = null
                };
            }
        }
    }
}