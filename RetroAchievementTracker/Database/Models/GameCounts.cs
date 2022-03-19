using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroAchievementTracker.Database.Models
{
    public class GameCounts
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ConsoleId { get; set; }
        public int GameCount { get; set; }
    }
}
