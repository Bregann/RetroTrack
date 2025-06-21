using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.DTOs.Controllers.Auth;
using RetroTrack.Domain.DTOs.Controllers.Auth.Responses;
using RetroTrack.Domain.Interfaces;
using RetroTrack.Domain.Interfaces.Controllers;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace RetroTrack.Domain.Services.Controllers
{
    public class AuthControllerDataService(AppDbContext context, IRetroAchievementsApiService raApiService) : IAuthControllerDataService
    {
        private readonly PasswordHasher<User> _passwordHasher = new();

        public async Task<LoginUserResponseDto> LoginUser(string username, string password)
        {
            //Get the user
            var user = await context.Users.FirstOrDefaultAsync(x => x.LoginUsername == username);

            if (user == null)
            {
                Log.Information($"[User Login] Attempted login with username {username} failed due to user not existing");
                throw new KeyNotFoundException($"User with username {username} does not exist.");
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
                throw new UnauthorizedAccessException("Incorrect password provided for user " + username);
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            await SaveRefreshToken(refreshToken, user.Id);

            Log.Information($"User logged in {username}");

            return new LoginUserResponseDto
            {
                AccessToken = token,
                RefreshToken = refreshToken
            };
        }

        public async Task RegisterUser(string username, string password, string raApiKey)
        {
            try
            {
                //Validate the API key to make sure that it's the correct username/api key combo
                var validKey = await raApiService.ValidateApiKey(username, raApiKey);

                if (!validKey.IsValidKey)
                {
                    throw new UnauthorizedAccessException("Error validating API key. Please double check your username and RetroAchievements API key and try again");
                }

                //Check if the user is actually registered
                if (context.Users.Any(x => x.LoginUsername == username))
                {
                    Log.Information($"[Register User] User {username} already exists");

                    throw new UnauthorizedAccessException("User already registered. Forgot your password? Use the forgot password link on the login form");
                }

                //Get the users details from the API
                var userProfile = await raApiService.GetUserProfile(username, validKey.UsernameUlid);

                if (userProfile == null)
                {
                    Log.Warning($"[Register User] Error getting user profile for {username}");
                    throw new UnauthorizedAccessException("There has been an error retrieving your user profile from RetroAchievements. Please try again");
                }

                //Add the user into the database
                await context.Users.AddAsync(new User
                {
                    LoginUsername = username,
                    RAUsername = userProfile.User,
                    RAUserUlid = userProfile.Ulid,
                    HashedPassword = _passwordHasher.HashPassword(new User(), password),
                    HashedPasswordMigrated = true,
                    LastActivity = DateTime.UtcNow,
                    LastUserUpdate = DateTime.UtcNow,
                    LastAchievementsUpdate = DateTime.UtcNow,
                    UserPoints = userProfile.TotalPoints,
                    UserProfileUrl = "/UserPic/" + userProfile.User + ".png",
                });

                await context.SaveChangesAsync();

                Log.Information($"[Register User] {username} succesfully registered");
            }
            catch (Exception ex)
            {
                Log.Fatal($"[Register User] Error registering user - {ex}");
                throw new UnauthorizedAccessException("There has been an error trying to register your account. Please try again", ex);
            }
        }

        public async Task ResetUserPassword(string raUsername, string password, string raApiKey)
        {
            //Validate the API key to make sure that it's the correct username/api key combo
            var response = await raApiService.ValidateApiKey(raUsername, raApiKey);

            if (!response.IsValidKey)
            {
                throw new UnauthorizedAccessException("Error validating API key. Please double check your username and RetroAchievements API key and try again");
            }

            // check if the ulid matches the user
            var user = await context.Users.FirstOrDefaultAsync(x => x.RAUserUlid == response.UsernameUlid);

            if (user == null)
            {
                Log.Information($"[Password Reset] User {raUsername} doesn't exist");
                throw new UnauthorizedAccessException("We couldn't verify your RA account. Please double check your username and API key.");
            }

            // hash the password and store it
            var hashedPassword = _passwordHasher.HashPassword(user, password);
            user.HashedPassword = hashedPassword;
            user.HashedPasswordMigrated = true;
            user.LastActivity = DateTime.UtcNow;

            await context.SaveChangesAsync();

            Log.Information($"[Password Reset] {raUsername} successfully reset their password");
        }

        public async Task DeleteUserSession(string token)
        {
            await context.UserRefreshTokens.Where(x => x.Token == token).ExecuteDeleteAsync();

            Log.Information($"[Logout User] Session {token} deleted");
        }

        private static string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.LoginUsername),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JwtKey")!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: Environment.GetEnvironmentVariable("JwtValidIssuer"),
                audience: Environment.GetEnvironmentVariable("JwtValidAudience"),
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(128));
        }

        private async Task SaveRefreshToken(string token, int userId)
        {
            var refreshToken = new UserRefreshToken
            {
                Token = token,
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(30)
            };

            context.UserRefreshTokens.Add(refreshToken);
            await context.SaveChangesAsync();
        }
    }
}