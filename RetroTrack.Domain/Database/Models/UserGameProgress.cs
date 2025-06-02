using RetroTrack.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class UserGameProgress
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Username")]
        public virtual Users User { get; set; } = null!;
        public required string Username { get; set; }

        [ForeignKey("GameId")]
        public virtual Games Game { get; set; } = null!;
        public required int GameId {  get; set; }

        [ForeignKey("ConsoleId")]
        public virtual GameConsoles Console { get; set; } = null!;
        public required int ConsoleId { get; set; }

        public required int AchievementsGained { get; set; }
        public required int AchievementsGainedHardcore { get; set; }
        public required double GamePercentage { get; set; }
        public required double GamePercentageHardcore { get; set; }
        public HighestAwardKind? HighestAwardKind { get; set; }
        public DateTime? HighestAwardDate { get; set; }
    }
}