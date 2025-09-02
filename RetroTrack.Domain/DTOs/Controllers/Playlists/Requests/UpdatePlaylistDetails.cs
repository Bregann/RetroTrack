namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class UpdatePlaylistDetails
    {
        public required string PlaylistId { get; set; }
        public required string PlaylistName { get; set; }
        public string? Description { get; set; }
        public bool IsPublic { get; set; }
    }
}
