namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class ReorderPlaylistGamesRequest
    {
        public required string PlaylistId { get; set; }
        public required ReorderRow[] ReorderData { get; set; } = [];
    }

    public class ReorderRow
    {
        public required int GameId { get; set; }
        public required int NewIndex { get; set; }
    }
}
