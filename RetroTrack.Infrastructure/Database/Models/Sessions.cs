using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Sessions
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [ForeignKey("Users")]
        public required int UserId { get; set; }
        public virtual Users User { get; set; }

        public required string SessionId { get; set; }
        public required DateTime ExpiryTime { get; set; }
    }
}