using RetroAchievementTracker.Database.Context;

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
    }
}
