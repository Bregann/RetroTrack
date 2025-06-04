using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Domain.Database.Models
{
    public class Users
    {
        [Key]
        public required string Username { get; set; }

        [Required]
        public required string RAUsername { get; set; }

        [Required]
        public required string HashedPassword { get; set; }

        [Required]
        public required DateTime LastActivity { get; set; }

        [Required]
        public required DateTime LastUserUpdate { get; set; }

        [Required]
        public required DateTime LastAchievementsUpdate { get; set; }

        [Required]
        public required string UserProfileUrl { get; set; }

        [Required]
        public required long UserPoints { get; set; }

        public virtual ICollection<TrackedGames> TrackedGames { get; set; } = null!;
        public virtual ICollection<Sessions> Sessions { get; set; } = null!;
        public virtual ICollection<UserGameProgress> UserGameProgress { get; set; } = null!;
    }
}