using Microsoft.AspNetCore.Identity;
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
        private readonly PasswordHasher<Users> _passwordHasher = new();

        public async Task<LoginUserDto> ValidateUserLogin(string username, string password)
        {
            //Get the user
            var user = await context.Users.FirstOrDefaultAsync(x => x.LoginUsername == username);

            if (user == null)
            {
                Log.Information($"[User Login] Attempted login with username {username} failed due to user not existing");

                return new LoginUserDto
                {
                    Successful = false
                };
            }

            var isMatch = false;

            if (user.HashedPasswordMigrated)
            {
                isMatch = _passwordHasher.VerifyHashedPassword(user, user.HashedPassword, password) == PasswordVerificationResult.Success;
            }
            else
            {
                isMatch = BCrypt.Net.BCrypt.Verify(password, user.OldHashedPassword);

                //If the old password is correct, migrate to the new password system
                if (isMatch)
                {
                    user.HashedPassword = _passwordHasher.HashPassword(user, password);
                    user.HashedPasswordMigrated = true;
                    await context.SaveChangesAsync();

                    Log.Information($"[User Login] Migrated user {username} to new password system");
                }
            }

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
            await context.Sessions.AddAsync(new Sessions
            {
                SessionId = sessionId,
                UserId = user.Id,
                ExpiryTime = DateTime.UtcNow.AddDays(30),
            });

            await context.SaveChangesAsync();
            Log.Information($"[User Login] Attempted login with username {username} successful");

            user.LastActivity = DateTime.UtcNow;
            await context.SaveChangesAsync();

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

                if (!validKey.IsValidKey)
                {
                    return new RegisterUserDto
                    {
                        Success = false,
                        Reason = "Error validating API key. Please double check your username and RetroAchievements API key and try again"
                    };
                }

                //Check if the user is actually registered
                if (context.Users.Any(x => x.LoginUsername == username))
                {
                    Log.Information($"[Register User] User {username} already exists");

                    return new RegisterUserDto
                    {
                        Success = false,
                        Reason = "User already registered. Forgot your password? Use the forgot password link on the login form"
                    };
                }

                //Get the users details from the API
                var userProfile = await raApiService.GetUserProfile(username, validKey.UsernameUlid);

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
                await context.Users.AddAsync(new Users
                {
                    LoginUsername = username,
                    RAUsername = userProfile.User,
                    RAUserUlid = userProfile.Ulid,
                    HashedPassword = _passwordHasher.HashPassword(new Users(), password),
                    HashedPasswordMigrated = true,
                    LastActivity = DateTime.UtcNow,
                    LastUserUpdate = DateTime.UtcNow,
                    LastAchievementsUpdate = DateTime.UtcNow,
                    UserPoints = userProfile.TotalPoints,
                    UserProfileUrl = "/UserPic/" + userProfile.User + ".png",
                });

                await context.SaveChangesAsync();

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

        public async Task<ResetUserPasswordDto> ResetUserPassword(string raUsername, string password, string raApiKey)
        {
            //Validate the API key to make sure that it's the correct username/api key combo
            var response = await raApiService.ValidateApiKey(raUsername, raApiKey);

            if (!response.IsValidKey)
            {
                return new ResetUserPasswordDto
                {
                    Success = false,
                    Reason = "Error validating API key. Please double check your username and RetroAchievements API key and try again"
                };
            }

            // check if the ulid matches the user
            var user = await context.Users.FirstOrDefaultAsync(x => x.RAUserUlid == response.UsernameUlid);

            if (user == null)
            {
                Log.Information($"[Password Reset] User {raUsername} doesn't exist");

                return new ResetUserPasswordDto
                {
                    Success = false,
                    Reason = "We couldn't verify your RA account. Please double check your username and API key."
                };
            }

            // hash the password and store it
            var hashedPassword = _passwordHasher.HashPassword(user, password);
            user.HashedPassword = hashedPassword;
            user.HashedPasswordMigrated = true;
            user.LastActivity = DateTime.UtcNow;

            await context.SaveChangesAsync();

            Log.Information($"[Password Reset] {raUsername} successfully reset their password");
            return new ResetUserPasswordDto
            {
                Success = true,
                Reason = null
            };
        }

        public async Task<bool> ValidateSessionStatus(string sessionId)
        {
            var session = await context.Sessions.FirstOrDefaultAsync(x => x.SessionId == sessionId);

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