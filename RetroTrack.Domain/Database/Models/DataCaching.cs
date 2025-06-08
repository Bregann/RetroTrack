using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class DataCaching
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required string CacheName { get; set; }

        [Required]
        public required string CacheData { get; set; }

        [Required]
        public required int MinutesToCacheFor { get; set; }

        [Required]
        public required DateTime LastUpdate { get; set; } = DateTime.UtcNow;
    }
}