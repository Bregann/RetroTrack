using Microsoft.AspNetCore.Http;
using RetroTrack.Infrastructure.Database.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

                var t = context.Sessions.ToList();

                var user = context.Sessions.Where(x => x.SessionId == authHeader).FirstOrDefault();



                if (user == null)
                {
                    return null;
                }
                else
                {
                    return user.User.Username;
                }
            }
        }
    }
}
