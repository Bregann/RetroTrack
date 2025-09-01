using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Responses
{
    public class GetLoggedInPlaylistDataResponse
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required int NumberOfLikes { get; set; }
        public required int NumberOfGames { get; set; }
        public required int NumberOfConsoles { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public required string CreatedBy { get; set; } = string.Empty;
        public required string[] Icons { get; set; } = [];
        public required long TotalGamesInPlaylist { get; set; }
        public required long TotalPointsToEarn { get; set; }
        public required long TotalAchievementsToEarn { get; set; }
        public required long TotalAchievementsEarnedSoftcore { get; set; }
        public required long TotalAchievementsEarnedHardcore { get; set; }
        public required long TotalGamesBeatenSoftcore { get; set; }
        public required long TotalGamesBeatenHardcore { get; set; }
        public required long TotalGamesCompletedSoftcore { get; set; }
        public required long TotalGamesMasteredHardcore { get; set; }
        public required double PercentageBeaten { get; set; }
        public required double PercentageMastered { get; set; }
        public required double PercentageAchievementsGained { get; set; }
        public required LoggedInGameItem[] Games { get; set; } = [];
        public required bool IsPlaylistOwner { get; set; }
        public required bool IsPublic { get; set; }
        public required bool IsLiked { get; set; }
    }

    public class LoggedInGameItem : PlaylistGameItem
    {
        public HighestAwardKind? HighestAward { get; set; }
        public int AchievementsEarnedSoftcore { get; set; }
        public int AchievementsEarnedHardcore { get; set; }
    }
}
