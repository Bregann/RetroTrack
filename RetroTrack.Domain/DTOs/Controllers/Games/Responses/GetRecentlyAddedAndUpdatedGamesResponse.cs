using RetroTrack.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Games.Responses
{
    public class GetRecentlyAddedAndUpdatedGamesResponse
    {
        public required List<DayData> Days { get; set; }
    }

    public class DayData
    {
        public required string Date { get; set; }
        public required GameData[] NewSets { get; set; }
        public required GameData[] UpdatedSets { get; set; }
    }

    public class GameData
    {
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required string GameIcon { get; set; }
        public required string ConsoleName { get; set; }
        public required ConsoleType ConsoleType { get; set; }
        public required string AchievementCount { get; set; }
        public required string Points { get; set; }
    }
}
