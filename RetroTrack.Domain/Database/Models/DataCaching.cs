using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class DataCaching
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string CacheName { get; set; }
        public string CacheData { get; set; }
        public int MinutesToCacheFor { get; set; }
        public DateTime LastUpdate { get; set; }
    }
}