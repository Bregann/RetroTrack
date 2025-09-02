namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class GetLoggedInPlaylistDataRequest : GetPublicPlaylistDataRequest
    {
        public bool? SortByAchievementProgress { get; set; } = null;
        public bool? SortByCompletionStatus { get; set; } = null;
    }
}
