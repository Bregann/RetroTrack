using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroAchievementTracker.Database.Models
{
    public class Games
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Title { get; set; }
        public int ConsoleID { get; set; }
        public string ConsoleName { get; set; }
        public string? ImageIcon { get; set; }
        public string? ImageIngame { get; set; }
        public string? ImageBoxArt { get; set; }
        public DateTime? DateAdded { get; set; }
        public string? GameGenre { get; set; }
        public int? AchievementCount { get; set; }
        public int? PlayersCasual { get; set; }
        public int? PlayersHardcore { get; set; }
        public bool IsProcessed { get; set; }
    }
}
