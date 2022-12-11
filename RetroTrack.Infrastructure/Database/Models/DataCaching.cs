using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Infrastructure.Database.Models
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
