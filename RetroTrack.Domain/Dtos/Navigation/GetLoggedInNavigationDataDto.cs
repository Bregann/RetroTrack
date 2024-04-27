namespace RetroTrack.Domain.Dtos.Navigation
{
    public class GetLoggedInNavigationDataDto
    {
        public required string RAName { get; set; }
        public required string RAUserProfileUrl { get; set; }
        public required int GamesBeaten { get; set; }
        public required int GamesMastered { get; set; }
        public required long UserPoints { get; set; }
        public required long UserRank { get; set; }
        public required ConsoleProgressData[] ConsoleProgressData { get; set;}
    }

    public class ConsoleProgressData
    {
        public required int ConsoleId { get; set; }
        public required int GamesMastered { get; set; }
        public required int GamesBeaten { get; set; }
        public required int TotalGamesInConsole { get; set; }
        public required double PercentageBeaten { get; set; }
        public required double PercentageMastered { get; set; }
    }
}
