using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Responses
{
    public class GetPlaylistResponse
    {
        public required PlaylistItem[] Playlists { get; set; } = [];
    }

    public class PlaylistItem
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required int NumberOfLikes { get; set; }
        public required int NumberOfGames { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public required string CreatedBy { get; set; } = string.Empty;
        public required string[] Icons { get; set; } = [];
        public required bool IsPublic { get; set; }
    }
}
