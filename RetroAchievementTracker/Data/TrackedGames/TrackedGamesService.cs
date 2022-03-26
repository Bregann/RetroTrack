using RetroAchievementTracker.Database.Context;

namespace RetroAchievementTracker.Data.TrackedGames
{
    public class TrackedGamesService
    {
        public static bool IsGameTracked(int gameId, string username)
        {
            using (var context = new DatabaseContext())
            {
                return context.TrackedGames.Where(x => x.UsernameGameID == $"{username}-{gameId}").Count() != 0;
            }
        }

        public void AddTrackedGame(int gameId, string username)
        {
            using (var context = new DatabaseContext())
            {
                context.TrackedGames.Add(new Database.Models.TrackedGames
                {
                    GameID = gameId,
                    UsernameGameID = $"{username}-{gameId}",
                    Username = username
                });

                context.SaveChanges();
            }
        }

        public void DeleteTrackedGame(int gameId, string username)
        {
            using (var context = new DatabaseContext())
            {
                context.TrackedGames.Remove(new Database.Models.TrackedGames
                {
                    GameID = gameId,
                    UsernameGameID = $"{username}-{gameId}",
                    Username = username
                });

                context.SaveChanges();
            }
        }
    }
}
