using RetroTrack.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class Achievements
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
        [ForeignKey(nameof(GameId))]
        public required int GameId { get; set; }
        public virtual Games Game { get; set; } = null!;
    }
}