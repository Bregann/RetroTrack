using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Library.Responses
{
    public class GetUserLibraryDataResponse
    {
        public required LibraryConsole[] Consoles { get; set; }
        public required LibraryTrackedGame[] TrackedGames { get; set; }
    }

    public class LibraryConsole
    {
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required ConsoleType ConsoleType { get; set; }
    }

    public class LibraryTrackedGame
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required string ImageIcon { get; set; }
        public required string ImageBoxArt { get; set; }
        public required int AchievementCount { get; set; }
        public required int Points { get; set; }
        public int AchievementsEarned { get; set; }
        public double PercentageComplete { get; set; }
        public HighestAwardKind? HighestAward { get; set; }
    }
}
