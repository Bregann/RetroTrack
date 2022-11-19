using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Users
    {
        [Key]
        public required string Username { get; set; }
        public required string HashedApiKey { get; set; }
        public required string HashedPassword { get; set; }
        public required DateTime LastActivity { get; set; }
        public required List<UserGameProgress> UserGameProgress { get; set; }
        public required List<TrackedGames> TrackedGames { get; set; }
        public required List<Sessions> Sessions { get; set; }
    }
}
