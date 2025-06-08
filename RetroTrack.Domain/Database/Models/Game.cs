using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class Game
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required int ConsoleId { get; set; }
        [ForeignKey(nameof(ConsoleId))]
        public virtual GameConsole GameConsole { get; set; } = null!;

        [Required]
        public required string ImageIcon { get; set; }

        [Required]
        public required int Points { get; set; }

        [Required]
        public required DateTime LastModified { get; set; } = new DateTime(0, DateTimeKind.Utc);

        public DateTime? LastExtraDataProcessedDate { get; set; }

        [Required]
        public required DateTime SetReleasedDate { get; set; } = new DateTime(0, DateTimeKind.Utc);

        [Required]
        public required DateTime LastAchievementCountChangeDate { get; set; } = new DateTime(0, DateTimeKind.Utc);

        [Required]
        public required int AchievementCount { get; set; }

        public string? GameGenre { get; set; }
        public int? Players { get; set; }

        [Required]
        public required bool HasAchievements { get; set; }

        [Required]
        public required bool ExtraDataProcessed { get; set; }

        [Required]
        public required bool DiscordMessageProcessed { get; set; }

        [Required]
        public required bool EmailMessageProcessed { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public virtual ICollection<Achievement> Achievements { get; set; } = [];
    }
}