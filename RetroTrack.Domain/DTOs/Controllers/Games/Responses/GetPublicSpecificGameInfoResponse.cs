using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Games.Responses
{
    public class GetPublicSpecificGameInfoResponse
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
        public required List<Achievement> Achievements { get; set; }
        public long? MedianTimeToBeatHardcoreSeconds { get; set; }
        public string? MedianTimeToBeatHardcoreFormatted { get; set; }
        public long? MedianTimeToMasterSeconds { get; set; }
        public string? MedianTimeToMasterFormatted { get; set; }
        public List<SubsetGame> Subsets { get; set; } = new List<SubsetGame>();
    }

    public class Achievement
    {
        public long Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public long Points { get; set; }
        public required string BadgeName { get; set; }
        public AchievementType? Type { get; set; }
        public required int AchievementOrder { get; set; }
    }

    public class SubsetGame
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required string GameImage { get; set; }
        public required int AchievementCount { get; set; }
        public required int Points { get; set; }
        public int AchievementsUnlocked { get; set; } = 0;
        public double PercentageComplete { get; set; } = 0;
        public List<SubsetAchievement> Achievements { get; set; } = new List<SubsetAchievement>();
    }

    public class SubsetAchievement
    {
        public required long Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required int Points { get; set; }
        public required string BadgeName { get; set; }
        public required AchievementType? Type { get; set; }
        public required int AchievementOrder { get; set; }
        public string? DateEarnedSoftcore { get; set; }
        public string? DateEarnedHardcore { get; set; }
    }
}

