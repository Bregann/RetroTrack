using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class GetPublicPlaylistDataRequest
    {
        public required string PlaylistId { get; set; }
        public string? SearchTerm { get; set; } = null;
        public bool? SortByIndex { get; set; } = false;
        public bool? SortByGameTitle { get; set; } = false;
        public bool? SortByConsoleName { get; set; } = false;
        public bool? SortByGenre { get; set; } = false;
        public bool? SortByAchievementCount { get; set; } = false;
        public bool? SortByPoints { get; set; } = false;
    }
}
