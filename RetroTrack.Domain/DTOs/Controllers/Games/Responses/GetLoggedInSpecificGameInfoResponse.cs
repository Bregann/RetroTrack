using RetroTrack.Domain.DTOs.Controllers.Playlists.Responses;
using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Games.Responses
{
    public class GetLoggedInSpecificGameInfoResponse
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required string GameImage { get; set; }
        public required string Publisher { get; set; }
        public required string Developer { get; set; }
        public required string ImageInGame { get; set; }
        public required string ImageTitle { get; set; }
        public required string ImageBoxArt { get; set; }
        public required string Genre { get; set; }
        public required int AchievementCount { get; set; }
        public required int Players { get; set; }
        public required bool GameTracked { get; set; }

        public required List<UserAchievement> Achievements { get; set; }
        public required int AchievementsAwardedSoftcore { get; set; }
        public required int AchievementsAwardedHardcore { get; set; }
        public required int AchievementsAwardedTotal { get; set; }
        public required int PointsAwardedSoftcore { get; set; }
        public required int PointsAwardedHardcore { get; set; }
        public required int PointsAwardedTotal { get; set; }
        public required int TotalGamePoints { get; set; }

        public string? DateBeatenSoftcore { get; set; }
        public string? DateBeatenHardcore { get; set; }
        public string? DateCompleted { get; set; }
        public string? DateMastered { get; set; }

        public string? UserNotes { get; set; }

        public required UserPlaylist[] Playlists { get; set; }

        public long? MedianTimeToBeatHardcoreSeconds { get; set; }
        public string? MedianTimeToBeatHardcoreFormatted { get; set; }
        public long? MedianTimeToMasterSeconds { get; set; }
        public string? MedianTimeToMasterFormatted { get; set; }
    }

    public class UserAchievement
    {
        public required long Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required int Points { get; set; }
        public required string BadgeName { get; set; }
        public required string? DateEarnedSoftcore { get; set; }
        public required string? DateEarnedHardcore { get; set; }
        public required AchievementType? Type { get; set; }
        public required int AchievementOrder { get; set; }
    }
}

