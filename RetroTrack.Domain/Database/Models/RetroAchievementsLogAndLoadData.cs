using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class RetroAchievementsLogAndLoadData
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required string JsonData { get; set; }

        [Required]
        public required ProcessingStatus ProcessingStatus { get; set; }

        [Required]
        public required int FailedProcessingAttempts { get; set; }

        [Required]
        public required JobType JobType { get; set; }

        [Required]
        public required DateTime LastUpdate { get; set; } = DateTime.UtcNow;

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public virtual ICollection<RetroAchievementsLogAndLoadError> Errors { get; set; } = null!;
    }
}
