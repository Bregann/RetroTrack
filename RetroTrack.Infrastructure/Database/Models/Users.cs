using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Users
    {
        [Key]
        public required string Username { get; set; }
        public required string RAUsername { get; set; }
        public required string HashedPassword { get; set; }
        public required DateTime LastActivity { get; set; }
        public required DateTime LastUserUpdate { get; set; }
        public required DateTime LastAchievementsUpdate { get; set; }
        public required string UserProfileUrl { get; set; }
        public required long UserPoints { get; set; }
        public required long UserRank { get; set; }
        public virtual List<TrackedGames> TrackedGames { get; set; }
        public virtual List<DevWishlist> DevWishlist { get; set; }
        public virtual List<Sessions> Sessions { get; set; }
    }
}