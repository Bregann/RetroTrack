using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class UserGamesTableDto
    {
        public required int GameId { get; set; }
        public required string GameIconUrl { get; set; }
        public required string GameName { get; set; }
        public required int AchievementCount { get; set; }
        public required int AchievementsGained { get; set; }
        public required double PercentageCompleted { get; set; }
        public required string? GameGenre { get; set; }
        public required string Console { get; set; }
    }
}
