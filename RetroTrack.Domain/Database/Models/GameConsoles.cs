using RetroTrack.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class GameConsoles
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ConsoleID { get; set; }

        [Required]
        public required string ConsoleName { get; set; }

        [Required]
        public required int GameCount { get; set; }

        [Required]
        public required int NoAchievementsGameCount { get; set; }

        [Required]
        public required ConsoleType ConsoleType { get; set; }

        [Required]
        public required bool DisplayOnSite { get; set; }
    }
}