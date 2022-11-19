using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class GameConsoles
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public required int ConsoleID { get; set; }
        public required string ConsoleName { get; set; }
    }
}
