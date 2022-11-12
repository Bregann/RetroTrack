using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Games
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public required int Id { get; set; }
        public required string Title { get; set; }
        public required int ConsoleID { get; set; }
        public required string ConsoleName { get; set; }
        public string? ImageIcon { get; set; }
        public string? ImageIngame { get; set; }
        public string? ImageBoxArt { get; set; }
        public DateTime? LastModified { get; set; }
        public string? GameGenre { get; set; }
        public int? AchievementCount { get; set; }
        public int? PlayersCasual { get; set; }
        public int? PlayersHardcore { get; set; }
        public required bool IsProcessed { get; set; }
    }
}
