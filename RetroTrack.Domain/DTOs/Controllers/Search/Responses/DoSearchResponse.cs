namespace RetroTrack.Domain.DTOs.Controllers.Search.Responses
{
    public class DoSearchResponse
    {
        public required int TotalGameResults { get; set; }
        public required int TotalAchievementResults { get; set; }
        public required GameSearchResult[] GameResults { get; set; }
        public required AchievementSearchResult[] AchievementResults { get; set; }
    }

    public class GameSearchResult
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required string Console { get; set; }
        public required string GameIconUrl { get; set; }
        public required int TotalAchievements { get; set; }
        public required int TotalPoints { get; set; }
        public required string Genre { get; set; }
    }

    public class AchievementSearchResult
    {
        public required long AchievementId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string IconUrl { get; set; }
        public required int Points { get; set; }
        public required int GameId { get; set; }
        public required string GameTitle { get; set; }
        public required string Console { get; set; }
    }
}
