using RetroTrack.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class Achievement
    {
        [Key]
        public required long Id { get; set; }

        [Required]
        public required string AchievementName { get; set; }

        [Required]
        public required string AchievementDescription { get; set; }

        [Required]
        public required string AchievementIcon { get; set; }

        [Required]
        public required int Points { get; set; }

        [Required]
        public required int DisplayOrder { get; set; }

        public AchievementType? AchievementType { get; set; }

        [Required]
        public required long NumAwarded { get; set; }

        [Required]
        public required long NumAwardedHardcore { get; set; }

        [Required]
        public required DateTime LastModified { get; set; }

        [Required]
        public required DateTime DateCreated { get; set; }

        [Required]
        public required string Author { get; set; }

        [Required]
        public required int GameId { get; set; }

        [ForeignKey(nameof(GameId))]
        public virtual Game Game { get; set; } = null!;
    }
}
