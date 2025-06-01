using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Domain.Database.Models
{
    public class TrackedGames
    {
        [Key]
        public required string Id { get; set; }

        public required Games Game { get; set; }
        public required Users User { get; set; }
    }
}