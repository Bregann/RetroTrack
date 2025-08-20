using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Navigation.Responses
{
    public class GetLoggedInNavigationDataResponse
    {
        public required string RAName { get; set; }
        public required string RAUserProfileUrl { get; set; }
        public required int GamesBeatenHardcore { get; set; }
        public required int GamesBeatenSoftcore { get; set; }
        public required int GamesCompleted { get; set; }
        public required int GamesMastered { get; set; }
        public required long UserPoints { get; set; }
        public required long TotalAchievementsSoftcore { get; set; }
        public required long TotalAchievementsHardcore { get; set; }
        public required int TrackedGamesCount { get; set; }
        public required int InProgressGamesCount { get; set; }
        public required ConsoleProgressData[] ConsoleProgressData { get; set; }
    }

    public class ConsoleProgressData
    {
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required ConsoleType ConsoleType { get; set; }
        public required int GamesBeatenHardcore { get; set; }
        public required int GamesBeatenSoftcore { get; set; }
        public required int GamesCompleted { get; set; }
        public required int GamesMastered { get; set; }
        public required int TotalGamesInConsole { get; set; }
        public required double PercentageBeatenSoftcore { get; set; }
        public required double PercentageBeatenHardcore { get; set; }
        public required double PercentageCompleted { get; set; }
        public required double PercentageMastered { get; set; }
    }
}