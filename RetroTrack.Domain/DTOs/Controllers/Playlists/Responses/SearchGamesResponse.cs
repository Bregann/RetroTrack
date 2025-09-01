namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Responses
{
    public class SearchGamesResponse
    {
        public required PlaylistSearchGameResult[] Results { get; set; }
    }

    public class PlaylistSearchGameResult
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required string ConsoleName { get; set; }
        public required string GameImage { get; set; }
        public required int AchievementCount { get; set; }
        public required int Points { get; set; }
    }
}
