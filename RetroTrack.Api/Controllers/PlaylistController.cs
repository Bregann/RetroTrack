using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PlaylistController(IPlaylistControllerDataService playlistControllerDataService) : ControllerBase
    {
    }
}
