using RetroTrack.Infrastructure.Database.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class UserGameProgress
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required Users User { get; set; }
        public required Games Game { get; set; }
        public required int AchievementsGained { get; set; }
        public required int AchievementsGainedHardcore { get; set; }

        [Obsolete("No longer returned by the API")]
        public int HardcoreMode { get; set; } // deprecated
        public required double GamePercentage { get; set; }
        public HighestAwardKind? HighestAwardKind { get; set; }
        public DateTime? HighestAwardDate { get; set; }
    }
}