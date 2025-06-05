using Microsoft.AspNetCore.Http;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Helpers;
using RetroTrack.Domain.Interfaces.Helpers;

namespace RetroTrack.Domain.Services.Helpers
{
    public class AuthHelperService(AppDbContext context) : IAuthHelperService
    {
        public UserDataDto? ValidateSessionIdAndReturnUserData(IHeaderDictionary headers)
        {
            var userSession = headers.Authorization.ToString();
            var username = headers["RtUsername"].ToString();

            if (string.IsNullOrEmpty(userSession) || string.IsNullOrEmpty(username))
            {
                return null;
            }

            var user = context.Sessions
                .Where(x => x.SessionId == userSession && x.User.LoginUsername == username)
                .Select(x => x.User)
                .FirstOrDefault();

            if (user == null)
            {
                return null;
            }
            else
            {
                return new UserDataDto
                {
                    UserId = user.Id,
                    Username = user.LoginUsername,
                    RaUlid = user.RAUserUlid
                };
            }
        }

        public string GetRAUsernameFromLoginUsername(string username) => context.Users.First(x => x.LoginUsername == username).RAUsername;
    }
}
