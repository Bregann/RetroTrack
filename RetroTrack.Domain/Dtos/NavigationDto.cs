namespace RetroTrack.Domain.Dtos
{
    public class NavigationGameCountsDto
    {
        public Dictionary<int, int> Games { get; set; }
    }

    public class LoggedInNavigationGameCountsDto
    {
        public required Dictionary<int, NavigationUserStats> Games { get; set; }
        public required int GamesTracked { get; set; }
        public required int InProgressGames { get; set; }
    }

    public class NavigationUserStats
    {
        public required string GamesTotalAndCompleted { get; set; }
        public required decimal Percentage { get; set; }
    }

    public class UserNavProfileDto
    {
        public required string ProfileImageUrl { get; set; }
        public required string Username { get; set; }
        public required long Points { get; set; }
        public required long Rank { get; set; }
        public required int GamesCompleted { get; set; }
    }
}