using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Users
    {
        [Key]
        public required string Username { get; set; }
        public required string HashedPassword { get; set; }
        public required DateTime LastActivity { get; set; }
        public required DateTime LastUserUpdate { get; set; }
        public required string UserProfileUrl { get; set; }
        public required long UserPoints { get; set; }
        public required long UserRank { get; set; }
        public virtual List<UserGameProgress> UserGameProgress { get; set; }
        public virtual List<TrackedGames> TrackedGames { get; set; }
        public virtual List<Sessions> Sessions { get; set; }
    }
}
