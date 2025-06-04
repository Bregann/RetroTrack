using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class Sessions
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(Username))]
        public required string Username { get; set; }
        public virtual Users User { get; set; } = null!;

        public required string SessionId { get; set; }
        public required DateTime ExpiryTime { get; set; }
    }
}