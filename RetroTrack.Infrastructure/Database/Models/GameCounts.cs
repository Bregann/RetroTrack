using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class GameCounts
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public required int ConsoleId { get; set; }
        public required int GameCount { get; set; }
    }
}
