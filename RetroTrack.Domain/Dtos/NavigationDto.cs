using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class NavigationGameCountsDto
    {
        public Dictionary<int, int> Games { get; set; }

    }

    public class LoggedInNavigationGameCountsDto
    {
        public Dictionary<int, NavigationUserStats> Games { get; set; }
    }

    public class NavigationUserStats
    {
        public required int GamesTotal { get; set; }
        public required int GamesCompleted { get; set; }
        public required string Percentage { get; set; }
    }
}
