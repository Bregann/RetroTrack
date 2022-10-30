using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Api.Database.Models
{
    public class GameConsoles
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ConsoleID { get; set; }

        public string ConsoleName { get; set; }
    }
}
