using RetroTrack.Infrastructure.Database.Context;

namespace RetroTrack.Domain.Helpers
{
    public class RAHelper
    {
        public static string GetRAUsernameFromLoginUsername(string username)
        {
            using (var context = new DatabaseContext())
            {
                return context.Users.First(x => x.Username == username).RAUsername;
            }
        }
    }
}
