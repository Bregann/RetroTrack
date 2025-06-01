using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Domain.Database.Models
{
    public class DevWishlist
    {
        [Key]
        public required string Id { get; set; }

        public required DevWishlist Game { get; set; }
        public required Users User { get; set; }
    }
}
