using RetroTrack.Infrastructure.Database.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Helpers
{
    public class LoginHelper
    {
        public static string? ValidateSessionIdAndReturnUsername(string sessionId)
        {
            using(var context = new DatabaseContext())
            {
                var user = context.Sessions.Where(x => x.SessionId == sessionId).FirstOrDefault();
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
