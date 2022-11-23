using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
