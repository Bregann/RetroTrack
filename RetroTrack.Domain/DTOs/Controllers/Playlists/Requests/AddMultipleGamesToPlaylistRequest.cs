namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class AddMultipleGamesToPlaylistRequest
    {
        public required string PlaylistId { get; set; }
        public required int[] GameIds { get; set; }
    }
}
