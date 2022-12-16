namespace RetroTrack.Domain.Dtos
{
    public class GameInfoDto
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required string ImageInGame { get; set; }
        public required string ImageBoxArt { get; set; }
        public required string Genre { get; set; }
        public required int AchievementCount { get; set; }
        public required int Players { get; set; }
        public required List<Achievement> Achievements { get; set; }
    }

    public class Achievement
    {
        public long Id { get; set; }
        public long NumAwarded { get; set; }
        public long NumAwardedHardcore { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public long Points { get; set; }
        public string BadgeName { get; set; }
    }
}