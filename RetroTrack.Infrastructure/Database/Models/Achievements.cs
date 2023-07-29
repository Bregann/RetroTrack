using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Achievements
    {
        public required long Id { get; set; }
        public required string AchievementName { get; set; }
        public required string AchievementDescription { get; set; }
        public required string AchievementIcon { get; set; }
        public required int Points { get; set; }
        public required int DisplayOrder { get; set; }

        public int GameId { get; set; }

        [ForeignKey("GameId")]
        public required Games Game { get; set; }
    }
}