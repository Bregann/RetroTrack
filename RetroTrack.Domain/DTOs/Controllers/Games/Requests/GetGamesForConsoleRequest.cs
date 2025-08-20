using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Games.Requests
{
    public class GetGamesForConsoleRequest
    {
        public required int ConsoleId { get; set; }
        public required int Skip { get; set; }
        public required int Take { get; set; }
        public bool? SortByName { get; set; } = null;
        public bool? SortByPlayerCount { get; set; } = null;
        public bool? SortByAchievementCount { get; set; } = null;
        public bool? SortByGenre { get; set; } = null;
        public bool? SortByPoints { get; set; } = null;
        public bool? SortByConsole { get; set; } = null;
        public string? SearchTerm { get; set; } = null;
        public ConsoleTableSearchType? SearchType { get; set; } = null;
    }
}