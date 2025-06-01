using RetroTrack.Domain.Enums;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Enums;

namespace RetroTrack.Domain.OldCode.Helpers
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

        public static HighestAwardKind? ConvertHighestAwardKind(string? awardKind)
        {
            if (awardKind == null)
            {
                return null;
            }

            switch (awardKind)
            {
                case "beaten-softcore":
                    return HighestAwardKind.BeatenSoftcore;
                case "beaten-hardcore":
                    return HighestAwardKind.BeatenHardcore;
                case "completed":
                    return HighestAwardKind.Completed;
                case "mastered":
                    return HighestAwardKind.Mastered;
                default:
                    return null;
            }
        }
    }
}
