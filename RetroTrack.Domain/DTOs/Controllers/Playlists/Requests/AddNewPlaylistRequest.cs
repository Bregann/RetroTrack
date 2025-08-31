using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class AddNewPlaylistRequest
    {
        public required string PlaylistName { get; set; }
        public string? Description { get; set; }
        public required bool IsPublic { get; set; }
    }
}
