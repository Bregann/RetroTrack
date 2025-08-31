namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class GetPublicPlaylistDataRequest
    {
        public required string PlaylistId { get; set; }
        public string? SearchTerm { get; set; } = null;
        public bool? SortByIndex { get; set; } = null;
        public bool? SortByGameTitle { get; set; } = null;
        public bool? SortByConsoleName { get; set; } = null;
        public bool? SortByGenre { get; set; } = null;
        public bool? SortByAchievementCount { get; set; } = null;
        public bool? SortByPoints { get; set; } = null;
        public bool? SortByPlayers { get; set; } = null;
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
