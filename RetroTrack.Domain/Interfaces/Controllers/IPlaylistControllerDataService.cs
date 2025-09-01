using RetroTrack.Domain.DTOs.Controllers.Playlists.Requests;
using RetroTrack.Domain.DTOs.Controllers.Playlists.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IPlaylistControllerDataService
    {
        Task AddGameToPlaylist(int userId, AddGameToPlaylistRequest request);
        Task AddMultipleGamesToPlaylist(int userId, AddMultipleGamesToPlaylistRequest request);
        Task AddNewPlaylist(int userId, AddNewPlaylistRequest request);
        Task<GetLoggedInPlaylistDataResponse> GetLoggedInPlaylistData(int userId, GetLoggedInPlaylistDataRequest request);
        Task<GetPublicPlaylistDataResponse> GetPublicPlaylistData(GetPublicPlaylistDataRequest request);
        Task<GetPlaylistResponse> GetPublicPlaylists();
        Task<GetPlaylistResponse> GetUserLikedPlaylists(int userId);
        Task<GetPlaylistResponse> GetUserPlaylists(int userId);
        Task RemoveGamesFromPlaylist(RemoveGamesFromPlaylist request, int userId);
        Task ReorderPlaylistGames(ReorderPlaylistGamesRequest request, int userId);
        Task<SearchGamesResponse> SearchGames(string gameTitle, string playlistId);
        Task TogglePlaylistLike(string playlistId, int userId);
    }
}
