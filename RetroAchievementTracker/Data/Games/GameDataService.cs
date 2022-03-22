using RetroAchievementTracker.Database.Context;
using RetroAchievementTracker.Database.Models;
using System.Linq;

namespace RetroAchievementTracker.Data.GameData
{
    public class GameDataService
    {
        public List<GameData> GetGamesAddedOnSpecificDate(DateTime dt)
        {
            var gameList = new List<Games>();

            //Get all the games from the specificed day and are processed (so it has all the data required)
            using (var context = new DatabaseContext())
            {
                gameList = context.Games.Where(x => x.DateAdded.Value.Day == dt.Day && 
                                                x.DateAdded.Value.Month == dt.Month && 
                                                x.DateAdded.Value.Year == dt.Year && 
                                                x.AchievementCount != 0 && 
                                                x.IsProcessed == true).ToList();
            }

            //Convert that to the object
            return (gameList.Select(game => new GameData
            {
                AchievementCount = (int)game.AchievementCount,
                Console = game.ConsoleName,
                GameIcon = $"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Images/{game.ImageIcon}",
                Genre = game.GameGenre,
                Title = game.Title
            })).ToList();
        }
    }
}
