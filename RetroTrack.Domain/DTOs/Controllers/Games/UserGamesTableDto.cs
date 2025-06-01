namespace RetroTrack.Domain.DTOs.Controllers.Games
{
    public class UserGamesTableDto
    {
        public required int GameId { get; set; }
        public required string GameIconUrl { get; set; }
        public required string GameName { get; set; }
        public required int AchievementCount { get; set; }
        public required int AchievementsGained { get; set; }
        public required double PercentageCompleted { get; set; }
        public required string? GameGenre { get; set; }
        public required int Players { get; set; }
        public string Console { get; set; }
    }
}