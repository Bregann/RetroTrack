using RetroTrack.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class UserGameProgress
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required int UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; } = null!;

        [Required]
        public required int GameId { get; set; }
        [ForeignKey(nameof(GameId))]
        public virtual Game Game { get; set; } = null!;

        [Required]
        public required int ConsoleId { get; set; }
        [ForeignKey(nameof(ConsoleId))]
        public virtual GameConsole Console { get; set; } = null!;

        [Required]
        public required int AchievementsGained { get; set; }

        [Required]
        public required int AchievementsGainedHardcore { get; set; }

        [Required]
        public required double GamePercentage { get; set; }

        [Required]
        public required double GamePercentageHardcore { get; set; }

        public DateTime? MostRecentAwardedDate { get; set; }

        public HighestAwardKind? HighestAwardKind { get; set; }

        public DateTime? HighestAwardDate { get; set; }
    }
}