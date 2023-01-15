using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class DevWishlist
    {
        [Key]
        public required string Id { get; set; }

        public required DevWishlist Game { get; set; }
        public required Users User { get; set; }
    }
}
