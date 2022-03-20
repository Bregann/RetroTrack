using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroAchievementTracker.Database.Models
{
    public class CompletedGames
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string UsernameGameID { get; set; }
        public int GameID { get; set; }
        public int ConsoleID { get; set; }
        public string Username { get; set; }
        public int AchievementsGained { get; set; }
        public string GameName { get; set; }
        public int HardcoreMode { get; set; }
    }
}
