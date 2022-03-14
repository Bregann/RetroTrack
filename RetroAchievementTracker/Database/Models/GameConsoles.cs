using System.ComponentModel.DataAnnotations;

namespace RetroAchievementTracker.Database.Models
{
    public class GameConsoles
    {
        public string ConsoleName { get; set; }
        [Key]
        public int ConsoleID { get; set; }
    }
}
