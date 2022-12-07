using Newtonsoft.Json;
using RetroTrack.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class UserGameInfoDto
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required int ConsoleId { get; set; }
        public required string ImageInGame { get; set; }
        public required string ImageBoxArt { get; set; }
        public required string Genre { get; set; }
        public required string ConsoleName { get; set; }
        public required int AchievementCount { get; set; }
        public required int Players { get; set; }
        public required List<UserAchievement> Achievements { get; set; }
        public required int NumAwardedToUser { get; set; }
        public required string UserCompletion { get; set; }
    }

    public class UserAchievement
    {
        public required int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required int Points { get; set; }
        public required string BadgeName { get; set; }
        public long NumAwarded { get; set; }
        public long NumAwardedHardcore { get; set; }
        public required string? DateEarned { get; set; }
    }
}
