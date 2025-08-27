namespace RetroTrack.Domain.DTOs.Controllers.Games.Responses
{
    public class GetLeaderboardsFromGameIdResponse
    {
        public required int TotalLeaderboards { get; set; }
        public required LeaderboardDetails[] Leaderboards { get; set; }
    }

    public class LeaderboardDetails
    {
        public required long LeaderboardId { get; set; }
        public required int Rank { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Author { get; set; }
        public required string TopUser { get; set; }
        public required string TopScore { get; set; }
    }
}
