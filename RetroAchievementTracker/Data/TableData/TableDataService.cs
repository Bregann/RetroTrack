using RetroAchievementTracker.Database.Context;
using RetroAchievementTracker.Database.Models;

namespace RetroAchievementTracker.Data.TableData
{
    public class TableDataService
    {
        public List<TableData> GetConsoleTableData(int consoleId, string? username = null)
        {
            var gameList = new List<Games>();
            var inProgressGames = new List<UserGameProgress>();

            //Get all the games from the console
            using (var context = new DatabaseContext())
            {
                gameList = context.Games.Where(x => x.ConsoleID == consoleId && x.AchievementCount != 0).ToList();

                //Check if it's not null and populate the list
                if (username != null)
                {
                    inProgressGames = context.UserGameProgress.Where(x => x.Username == username && x.ConsoleID == consoleId).ToList();
                }
            }

            //Get the game IDs in progress to check against the foreach loop
            var gameIdsInProgress = inProgressGames.Select(x => x.GameID).ToList();

            var tableData = new List<TableData>();

            //Add the games into the table data
            foreach (var game in gameList)
            {
                var achievementsGained = 0;
                double progress = 0;

                if (gameIdsInProgress.Contains(game.Id))
                {
                    achievementsGained = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.AchievementsGained).First();
                    progress = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.GamePercentage).First();
                }

                tableData.Add(new TableData
                {
                    Genre = game.GameGenre,
                    Id = game.Id,
                    PlayersCasual = (int)game.PlayersCasual,
                    PlayersHardcore = (int)game.PlayersHardcore,
                    Title = game.Title,
                    ImageIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Images/" + game.ImageIcon,
                    AchievementsGained = achievementsGained,
                    GamePercentage = progress,
                    AchievementCount = (int)game.AchievementCount
                });
            }

            return tableData;
        }
    }
}
