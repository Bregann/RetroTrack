using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class GameConsoles
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ConsoleID { get; set; }

        [Required]
        public required string ConsoleName { get; set; }

        [Required]
        public required int GameCount { get; set; }
    }
}