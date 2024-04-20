using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Config
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required string RetroAchievementsApiUsername { get; set; }

        [Required]
        public required string RetroAchievementsApiKey { get; set; }

        [Required]
        public required string HFConnectionString { get; set; }

        [Required]
        public required string HangfireUsername { get; set; }

        [Required]
        public required string HangfirePassword { get; set; }

        [Required]
        public required string ProjectMonitorApiKey { get; set; }

        [Required]
        public required string ApiSecret { get; set; }
    }
}