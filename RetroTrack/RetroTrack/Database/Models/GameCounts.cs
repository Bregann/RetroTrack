using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Api.Database.Models
{
    public class GameCounts
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ConsoleId { get; set; }
        public int GameCount { get; set; }
    }
}
