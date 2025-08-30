using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Requests
{
    public class GetLoggedInPlaylistDataRequest : GetPublicPlaylistDataRequest
    {
        public bool? SortByAchievementProgress { get; set; } = false;
        public bool? SortByCompletionStatus { get; set; } = false;
    }
}
