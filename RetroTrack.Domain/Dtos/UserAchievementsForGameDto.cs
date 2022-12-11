using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class UserAchievementsForGameDto
    {
        public bool Success { get; set; }
        public string Reason { get; set; }
        public required List<UserAchievement>? Achievements { get; set; }
    }
}
