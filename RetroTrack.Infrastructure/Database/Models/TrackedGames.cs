using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class TrackedGames
    {
        [Key]
        public required string Id { get; set; }

        public required Games Game { get; set; }
        public required Users User { get; set; }
    }
}