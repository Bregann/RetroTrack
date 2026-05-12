using RetroTrack.Domain.DTOs.Controllers.Games.Responses;

namespace RetroTrack.Domain.DTOs.Controllers.Users.Responses
{
    public class GetMobileHomeDataResponse
    {
        public required string Username { get; set; }
        public required string ProfileImageUrl { get; set; }
        public required long HardcorePoints { get; set; }
        public required long SoftcorePoints { get; set; }
        public required int TrackedGamesCount { get; set; }
        public required int PlaylistCount { get; set; }
        public required MobileLastPlayedGame? LastPlayedGame { get; set; }
        public required List<DayData> RecentDays { get; set; }
    }

    public class MobileLastPlayedGame
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required string GameIcon { get; set; }
        public required string ConsoleName { get; set; }
        public required int ConsoleType { get; set; }
        public required string AchievementCount { get; set; }
        public required string Points { get; set; }
    }
}
