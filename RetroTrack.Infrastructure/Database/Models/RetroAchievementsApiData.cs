using RetroTrack.Infrastructure.Database.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class RetroAchievementsApiData
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required string JsonData { get; set; }

        [Required]
        public required ProcessingStatus ProcessingStatus { get; set; }

        [Required]
        public required int FailedProcessingAttempts { get; set; }

        [Required]
        public required ApiRequestType ApiRequestType { get; set; }
    }
}
