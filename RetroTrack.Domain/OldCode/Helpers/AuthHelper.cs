using Microsoft.AspNetCore.Http;
using RetroTrack.Infrastructure.Database.Context;

namespace RetroTrack.Domain.OldCode.Helpers
{
    public class AuthHelper
    {
        public static string? ValidateSessionIdAndReturnUsername(IHeaderDictionary headers)
        {
            var userSession = headers.Authorization.ToString();
            var username = headers["RtUsername"].ToString();

            if (string.IsNullOrEmpty(userSession) || string.IsNullOrEmpty(username))
            {
                return null;
            }

            using (var context = new DatabaseContext())
            {
                var user = context.Sessions
                    .Where(x => x.SessionId == userSession && x.User.Username == username)
                    .Select(x => x.User)
                    .FirstOrDefault();

                if (user == null)
                {
                    return null;
                }
                else
                {
                    return user.Username;
                }
            }
        }
    }
}