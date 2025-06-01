using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class Sessions
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public required virtual Users User { get; set; }

        public required string SessionId { get; set; }
        public required DateTime ExpiryTime { get; set; }
    }
}