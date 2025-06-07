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
        [ForeignKey(nameof(UserId))]
        public required int UserId { get; set; }
        public virtual User User { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(GameId))]
        public required int GameId { get; set; }
        public virtual Game Game { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(ConsoleId))]
        public required int ConsoleId { get; set; }
        public virtual GameConsole Console { get; set; } = null!;

        [Required]
        public required int AchievementsGained { get; set; }

        [Required]
        public required int AchievementsGainedHardcore { get; set; }

        [Required]
        public required double GamePercentage { get; set; }

        [Required]
        public required double GamePercentageHardcore { get; set; }

        public HighestAwardKind? HighestAwardKind { get; set; }
        public DateTime? HighestAwardDate { get; set; }
    }
}