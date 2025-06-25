using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.TrackedGames.Requests
{
    public class GetUserTrackedGamesRequest
    {
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

        public bool? HideInProgressGames { get; set; } = null;
        public bool? HideBeatenGames { get; set; } = null;
        public bool? HideCompletedGames { get; set; } = null;
        public bool? HideUnstartedGames { get; set; } = null;
        public bool? SortByAchievementsUnlocked { get; set; } = null;
        public bool? SortByPercentageComplete { get; set; } = null;
    }
}
