using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class PublicGamesTableDto
    {
        public required int GameId { get; set; }
        public required string GameIconUrl { get; set; }
        public required string GameName { get; set; }
        public required int AchievementCount { get; set; }
        public required string? GameGenre { get; set; }
        public string Console { get; set; }
    }
}
