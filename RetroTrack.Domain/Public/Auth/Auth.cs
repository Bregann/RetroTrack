using RetroTrack.Domain.Dtos.Public;
using RetroTrack.Infrastructure.Database.Context;
using Serilog;

namespace RetroTrack.Domain.Public.Authenication
{
    public class Auth
    {
        public static LoginUserDto ValidateUserLogin(string username, string password)
        {
            using (var context = new DatabaseContext())
            {
                //Get the user
                var user = context.Users.FirstOrDefault(x => x.Username == username.ToLower());

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
                context.Sessions.Add(new Infrastructure.Database.Models.Sessions
                {
                    SessionId = sessionId,
                    Username = user.Username
                });

                context.SaveChanges();
                Log.Information($"[User Login] Attempted login with username {username} successful");

                return new LoginUserDto 
                { 
                    Successful = true, 
                    SessionId = sessionId 
                };
            }
        }
    }
}