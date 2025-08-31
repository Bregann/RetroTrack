using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class RemoveGamesFromPlaylist
    {
        public required string PlaylistId { get; set; }
        public required int[] GameIds { get; set; } = [];
    }
}
