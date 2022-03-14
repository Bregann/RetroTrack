using System.ComponentModel.DataAnnotations;

namespace RetroAchievementTracker.Database.Models
{
    public class CompletedGames
    {
        [Key]
        public string UsernameGameID { get; set; }
        public int GameID { get; set; }
        public string ImageIcon { get; set; }
        public string GameName { get; set; }
        public int HardcoreMode { get; set; }
    }
}
