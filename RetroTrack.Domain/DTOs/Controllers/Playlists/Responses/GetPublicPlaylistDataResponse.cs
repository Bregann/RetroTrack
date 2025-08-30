using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Playlists.Responses
{
    public class GetPublicPlaylistDataResponse
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required int NumberOfLikes { get; set; }
        public required int NumberOfGames { get; set; }
        public required int NumberOfConsoles { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public required string CreatedBy { get; set; } = string.Empty;
        public required string[] Icons { get; set; } = [];
        public required PlaylistGameItem[] Games { get; set; } = [];
        public required long TotalPointsToEarn { get; set; }
        public required long TotalAchievementsToEarn { get; set; }
    }

    public class PlaylistGameItem
    {
        public required int OrderIndex { get; set; }
        public required int GameId { get; set; }
        public required int Players { get; set; }
        public required string Title { get; set; }
        public required string ConsoleName { get; set; }
        public required string GameIconUrl { get; set; }
        public required string Genre { get; set; }
        public required int AchievementCount { get; set; }
        public required int Points { get; set; }
    }
}
