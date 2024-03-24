using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Models;
using Serilog;

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
            try
            {
                //Validate the API key to make sure that it's the correct username/api key combo
                var validKey = await RetroAchievements.ValidateApiKey(username, raApiKey);

                if (!validKey)
                {
                    return new RegisterUserDto
                    {
                        Success = false,
                        Reason = "Error validating API key. Please double check your username and RetroAchievements API key and try again"
                    };
                }

                using (var context = new DatabaseContext())
                {
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
                    var userProfile = await RetroAchievements.GetUserProfile(username);

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
                        UserRank = userProfile.Rank ?? 0
                    });

                    context.SaveChanges();

                    Log.Information($"[Register User] {username} succesfully registered");

                    return new RegisterUserDto
                    {
                        Success = true,
                        Reason = null
                    };
                }
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

        public static async Task<ResetUserPasswordDto> ResetUserPassword(string username, string password, string raApiKey)
        {
            //Validate the API key to make sure that it's the correct username/api key combo
            var validKey = await RetroAchievements.ValidateApiKey(username, raApiKey);

            if (!validKey)
            {
                return new ResetUserPasswordDto
                {
                    Success = false,
                    Reason = "Error validating API key. Please double check your username and RetroAchievements API key and try again"
                };
            }

            using (var context = new DatabaseContext())
            {
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
        }

    }
}