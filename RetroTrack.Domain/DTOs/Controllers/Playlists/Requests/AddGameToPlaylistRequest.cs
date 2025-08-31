namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class AddGameToPlaylistRequest
    {
        public required int GameId { get; set; }
        public required string PlaylistId { get; set; }
    }
}
