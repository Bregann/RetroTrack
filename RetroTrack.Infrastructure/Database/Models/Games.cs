using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Games
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public required int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required int GameConsoleId { get; set; }
        public string? ImageIcon { get; set; }
        public string? ImageIngame { get; set; }
        public string? ImageBoxArt { get; set; }
        public DateTime? LastModified { get; set; }
        public string? GameGenre { get; set; }
        public int? AchievementCount { get; set; }
        public int? PlayersCasual { get; set; }
        public int? PlayersHardcore { get; set; }

        [Required]
        public required bool IsProcessed { get; set; }
    }
}
