using Microsoft.EntityFrameworkCore;
using RetroAchievementTracker.Database.Context;
using RetroAchievementTracker.Database.Models;
using System.Linq;

namespace RetroAchievementTracker.Data.NavbarData
{
    public class NavBarService
    {
        public Dictionary<int, int> GetTotalGameCounts()
        {
            using (var context = new DatabaseContext())
            {
                return context.GameCounts.ToDictionary( x => x.ConsoleId, x => x.GameCount );
            }
        }

        public Dictionary<int, int> GetCompletedGamesForUser(string username)
        {
            using (var context = new DatabaseContext())
            {
                var consoleIds = context.GameConsoles.Select(x => x.ConsoleID).ToList();
                var dict = new Dictionary<int, int>();

                foreach (var console in consoleIds)
                {
                    dict.Add(console, context.UserGameProgress.Where(x => x.Username == username && x.ConsoleID == console && x.GamePercentage == 1).Count());
                }

                return dict;
            }
        }
    }
}
