using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Games
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        public int ConsoleID { get; set; }

        [ForeignKey("ConsoleID")]
        public required GameConsoles GameConsole { get; set; }

        [Required]
        public required string ImageIcon { get; set; }

        [Required]
        public required int Points { get; set; }

        [Required]
        public required DateTime LastModified { get; set; }

        [Required]
        public required int AchievementCount { get; set; }

        public string? GameGenre { get; set; }
        public int? Players { get; set; }

        [Required]
        public required bool ExtraDataProcessed { get; set; }

        [Required]
        public required bool DiscordMessageProcessed { get; set; }

        [Required]
        public required bool EmailMessageProcessed { get; set; }
    }
}