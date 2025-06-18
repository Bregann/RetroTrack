using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Games.Responses
{
    public class GetGamesForConsoleResponse
    {
        public required int TotalCount { get; set; }
        public required int TotalPages { get; set; }
        public required ConsoleGames[] Games { get; set; }
        public required string ConsoleName { get; set; }
    }

    public class ConsoleGames
    {
        public required int GameId { get; set; }
        public required string GameTitle { get; set; }
        public required string GameGenre { get; set; }
        public required int AchievementCount { get; set; }
        public required int PlayerCount { get; set; }
        public required string GameImageUrl { get; set; }
        public required long Points { get; set; }
        public string? ConsoleName { get; set; }
    }
}
