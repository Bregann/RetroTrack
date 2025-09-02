namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class GetPlaylistRequest
    {
        public string? SearchTerm { get; set; } = null;
        public bool? SortByNewest { get; set; } = null;
        public bool? SortByOldest { get; set; } = null;
        public bool? SortByMostLiked { get; set; } = null;
        public bool? SortByAtoZ { get; set; } = null;
    }
}
