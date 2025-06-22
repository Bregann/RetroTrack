using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Games.Requests
{
    public class GetUserProgressForConsoleRequest : GetGamesForConsoleRequest
    {
        public bool? HideInProgressGames { get; set; } = null;
        public bool? HideCompletedGames { get; set; } = null;
        public bool? SortByAchievementsUnlocked { get; set; } = null;
        public bool? SortByPercentageComplete { get; set; } = null;
    }
}
