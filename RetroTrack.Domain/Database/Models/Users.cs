using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class Users
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string LoginUsername { get; set; } = "";

        [Required]
        public string RAUsername { get; set; } = "";

        [Required]
        public string RAUserUlid { get; set; } = "";

        [Required]
        public string OldHashedPassword { get; set; } = "";

        [Required]
        public string HashedPassword { get; set; } = "";

        [Required]
        public bool HashedPasswordMigrated { get; set; }

        [Required]
        public DateTime LastActivity { get; set; }

        [Required]
        public DateTime LastUserUpdate { get; set; }

        [Required]
        public DateTime LastAchievementsUpdate { get; set; }

        [Required]
        public string UserProfileUrl { get; set; } = "";

        [Required]
        public long UserPoints { get; set; }

        public virtual ICollection<TrackedGames> TrackedGames { get; set; } = null!;
        public virtual ICollection<Sessions> Sessions { get; set; } = null!;
        public virtual ICollection<UserGameProgress> UserGameProgress { get; set; } = null!;
    }
}