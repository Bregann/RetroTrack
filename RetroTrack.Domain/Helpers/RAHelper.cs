using RetroTrack.Infrastructure.Database.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Helpers
{
    public class RAHelper
    {
        public static string GetRAUsernameFromLoginUsername(string username)
        {
            using(var context = new DatabaseContext())
            {
                return context.Users.First(x => x.Username == username).RAUsername;
            }
        }
    }
}
