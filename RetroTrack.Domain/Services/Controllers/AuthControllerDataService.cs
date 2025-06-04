using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Auth;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;
using Serilog;

namespace RetroTrack.Domain.Services.Controllers
{
    public class AuthControllerDataService(AppDbContext context, IRetroAchievementsApiService raApiService) : IAuthControllerDataService
    {
        public LoginUserDto ValidateUserLogin(string username, string password)
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
                Username = user.Username,
                ExpiryTime = DateTime.UtcNow.AddDays(30),
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

        public async Task<RegisterUserDto> RegisterUser(string username, string password, string raApiKey)
        {
            try
            {
                //Validate the API key to make sure that it's the correct username/api key combo
                var validKey = await raApiService.ValidateApiKey(username, raApiKey);

                if (!validKey)
                {
                    return new RegisterUserDto
                    {
                        Success = false,
                        Reason = "Error validating API key. Please double check your username and RetroAchievements API key and try again"
                    };
                }

                //Check if the user is actually registered
                if (context.Users.Any(x => x.Username == username.ToLower()))
                {
                    Log.Information($"[Register User] User {username} already exists");

                    return new RegisterUserDto
                    {
                        Success = false,
                        Reason = "User already registered. Forgot your password? Use the forgot password link on the login form"
                    };
                }

                //hash the password and store it
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

                //Get the users details from the API
                var userProfile = await raApiService.GetUserProfile(username);

                if (userProfile == null)
                {
                    Log.Information($"[Register User] Error getting user profile for {username}");
                    return new RegisterUserDto
                    {
                        Success = false,
                        Reason = "There has been an error retrieving your user profile from RetroAchievements. Please try again"
                    };
                }

                //Add the user into the database
                context.Users.Add(new Users
                {
                    Username = username,
                    RAUsername = userProfile.User,
                    HashedPassword = hashedPassword,
                    LastActivity = DateTime.UtcNow,
                    LastUserUpdate = DateTime.UtcNow,
                    LastAchievementsUpdate = DateTime.UtcNow,
                    UserPoints = userProfile.TotalPoints,
                    UserProfileUrl = "/UserPic/" + userProfile.User + ".png",
                });

                context.SaveChanges();

                Log.Information($"[Register User] {username} succesfully registered");

                return new RegisterUserDto
                {
                    Success = true,
                    Reason = null
                };
            }
            catch (Exception ex)
            {
                Log.Fatal($"[Register User] Error registering user - {ex}");
                return new RegisterUserDto
                {
                    Success = false,
                    Reason = "There has been an unknown error trying to register your account. Please try again"
                };
            }
        }

        public async Task<ResetUserPasswordDto> ResetUserPassword(string username, string password, string raApiKey)
        {
            //Validate the API key to make sure that it's the correct username/api key combo
            var validKey = await raApiService.ValidateApiKey(username, raApiKey);

            if (!validKey)
            {
                return new ResetUserPasswordDto
                {
                    Success = false,
                    Reason = "Error validating API key. Please double check your username and RetroAchievements API key and try again"
                };
            }

            var trackedGames = context.Users.Where(x => x.Username == username).Select(x => x.TrackedGames);
            var user = context.Users.FirstOrDefault(x => x.Username == username.ToLower());

            //Check if the user is actually registered
            if (user == null)
            {
                Log.Information($"[Password Reset] User {username} doesn't exist");

                return new ResetUserPasswordDto
                {
                    Success = false,
                    Reason = "User does not exist. Please register using the register popup"
                };
            }

            //hash the password and store it
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            //Add the user into the database
            user.HashedPassword = hashedPassword;
            user.LastActivity = DateTime.UtcNow;

            //Delete any sessions
            context.Sessions.Where(x => x.User.Username == username.ToLower()).ExecuteDelete();

            context.SaveChanges();

            Log.Information($"[Password Reset] {username} succesfully reset their password");

            return new ResetUserPasswordDto
            {
                Success = true,
                Reason = null
            };
        }

        public async Task<bool> ValidateSessionStatus(string sessionId)
        {
            var session = context.Sessions.FirstOrDefault(x => x.SessionId == sessionId);

            if (session == null)
            {
                return false;
            }

            //Check if it has expired
            if (session.ExpiryTime < DateTime.UtcNow)
            {
                context.Sessions.Remove(session);
                await context.SaveChangesAsync();
                return false;
            }

            session.ExpiryTime = DateTime.UtcNow.AddDays(30);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task DeleteUserSession(string sessionId)
        {
            await context.Sessions.Where(x => x.SessionId == sessionId).ExecuteDeleteAsync();

            Log.Information($"[Logout User] Session {sessionId} deleted");
        }
    }
}