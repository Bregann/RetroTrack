using RetroTrack.Domain.DTOs.Controllers.Navigation.Responses;
using RetroTrack.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Users.Responses
{
    public class GetUserProfileResponse
    {
        public required string RaUsername { get; set; }
        public required DateTime LastUserUpdate { get; set; }
        public required long SoftcorePoints { get; set; }
        public required long HardcorePoints { get; set; }
        public required int GamesBeatenSoftcore { get; set; }
        public required int GamesBeatenHardcore { get; set; }
        public required int GamesCompleted { get; set; }
        public required int GamesMastered { get; set; }
        public required int AchievementsEarnedSoftcore { get; set; }
        public required int AchievementsEarnedHardcore { get; set; }
        public required int GamesInProgress { get; set; }
        public required WallGame[] GamesBeatenWall { get; set; }
        public required WallGame[] GamesMasteredWall { get; set; }
        public required Last5GameInfo[] Last5GamesPlayed { get; set; }
        public required Last5GameInfo[] Last5Awards { get; set; }
        public required ConsoleProgressData[] ConsoleProgressData { get; set; }
    }

    public class WallGame
    {
        public required int GameId { get; set; }
        public required string ConsoleName { get; set; }
        public required string Title { get; set; }
        public required string ImageUrl { get; set; }
        public required DateTime DateAchieved { get; set; }
        public required bool IsHardcore { get; set; }
        public int WallPosition { get; set; } = -1; // default when not set
        public int ProgressId { get; set; } = -1; // default for logged out users
    }

    public class Last5GameInfo
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required string ImageUrl { get; set; }
        public required DateTime DatePlayed { get; set; }
        public required int TotalGameAchievements { get; set; }
        public required int TotalGamePoints { get; set; }
        public required int AchievementsUnlockedSoftcore { get; set; }
        public required int AchievementsUnlockedHardcore { get; set; }
        //public required int TotalPointsEarnedSoftcore { get; set; }
        //public required int TotalPointsEarnedHardcore { get; set; }
        public HighestAwardKind? HighestAward { get; set; }
    }
}