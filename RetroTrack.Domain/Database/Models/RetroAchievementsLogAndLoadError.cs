using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class RetroAchievementsLogAndLoadError
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(LogAndLoadDataId))]
        public int LogAndLoadDataId { get; set; }
        public virtual RetroAchievementsLogAndLoadData LogAndLoadData { get; set; } = null!;

        [Required]
        public required string ErrorMessage { get; set; }

        [Required]
        public required DateTime ErrorTimestamp { get; set; } = DateTime.UtcNow;
    }
}
