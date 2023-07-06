using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class Achievements
    {
        public required long Id { get; set; }
        public required string AchievementName { get; set; }
        public required string AchievementDescription { get; set; }
        public required string AchievementIcon { get; set; }
        public required int Points { get; set; }
        public required int DisplayOrder { get; set; }
        public required Games Game { get; set; }
    }
}
