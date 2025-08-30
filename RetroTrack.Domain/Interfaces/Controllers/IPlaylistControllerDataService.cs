using RetroTrack.Domain.DTOs.Controllers.Playlists.Requests;
using RetroTrack.Domain.DTOs.Controllers.Playlists.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IPlaylistControllerDataService
    {
        Task<GetPlaylistResponse> GetPublicPlaylists(GetPlaylistRequest request);
    }
}
