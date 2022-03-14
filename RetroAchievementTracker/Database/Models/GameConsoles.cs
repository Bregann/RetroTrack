using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroAchievementTracker.Database.Models
{
    public class GameConsoles
    {
        public string ConsoleName { get; set; }
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ConsoleID { get; set; }
    }
}
