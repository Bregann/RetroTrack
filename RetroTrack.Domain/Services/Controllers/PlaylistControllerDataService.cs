using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class PlaylistControllerDataService(AppDbContext context) : IPlaylistControllerDataService
    {
    }
}
