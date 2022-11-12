using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class TrackedGames
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public required string Id { get; set; }
        public required int GameID { get; set; }

        [ForeignKey("username")]
        public required string Username { get; set; }
    }
}
