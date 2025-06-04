using RetroTrack.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class Achievements
    {
        public required long Id { get; set; }
        public required string AchievementName { get; set; }
        public required string AchievementDescription { get; set; }
        public required string AchievementIcon { get; set; }
        public required int Points { get; set; }
        public required int DisplayOrder { get; set; }
        public AchievementType? AchievementType { get; set; }
        public required long NumAwarded { get; set; }
        public required long NumAwardedHardcore { get; set; }

        [ForeignKey(nameof(GameId))]
        public required int GameId { get; set; }
        public virtual Games Game { get; set; } = null!;
    }
}