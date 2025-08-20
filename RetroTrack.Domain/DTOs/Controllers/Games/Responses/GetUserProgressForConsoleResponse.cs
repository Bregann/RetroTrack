using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Games.Responses
{
    public class GetUserProgressForConsoleResponse
    {
        public required int TotalCount { get; set; }
        public required int TotalPages { get; set; }
        public required LoggedInConsoleGames[] Games { get; set; }
        public required string ConsoleName { get; set; }
    }

    public class LoggedInConsoleGames
    {
        public required int GameId { get; set; }
        public required string GameTitle { get; set; }
        public required string GameGenre { get; set; }
        public required int AchievementCount { get; set; }
        public required int AchievementsUnlocked { get; set; }
        public required double PercentageComplete { get; set; }
        public required int PlayerCount { get; set; }
        public required string GameImageUrl { get; set; }
        public required long Points { get; set; }
        public string? ConsoleName { get; set; }
        public HighestAwardKind? HighestAward { get; set; }
    }
}