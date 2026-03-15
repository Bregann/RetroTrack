using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Library.Responses
{
    public class GetUserLibraryDataResponse
    {
        public required LibraryConsole[] Consoles { get; set; }
        public required LibraryTrackedGame[] TrackedGames { get; set; }
        public required LibraryPlaylist[] Playlists { get; set; }
        public required string RaUsername { get; set; }
        public required string ProfileImageUrl { get; set; }
        public required long HardcorePoints { get; set; }
        public required int AchievementsEarnedHardcore { get; set; }
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
        public DateTime? LastPlayedUtc { get; set; }
    }

    public class LibraryPlaylist
    {
        public required string PlaylistId { get; set; }
        public required string Name { get; set; }
        public required int[] GameIds { get; set; }
    }
}
