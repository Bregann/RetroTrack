using Newtonsoft.Json;

namespace RetroAchievementTracker.Data.RetroAchievementsAPI.Models
{
    public class CompletedGamesData
    {
        [JsonProperty("GameID")]
        public int GameId { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("NumAwarded")]
        public int AchievementsAwarded { get; set; }

        [JsonProperty("HardcoreMode")]
        public int HardcoreMode { get; set; }

        [JsonProperty("PctWon")]
        public double? PctWon { get; set; }
    }
}
