using Microsoft.AspNetCore.Http;
using RetroTrack.Infrastructure.Database.Context;

namespace RetroTrack.Domain.Helpers
{
    public class AuthHelper
    {
        public static string? ValidateSessionIdAndReturnUsername(IHeaderDictionary headers)
        {
            if (headers["Authorization"].Count == 0)
            {
                return null;
            }

            using (var context = new DatabaseContext())
            {
                string authHeader = headers["Authorization"];

                var user = context.Sessions.Where(x => x.SessionId == authHeader).Select(x => x.User).FirstOrDefault();

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