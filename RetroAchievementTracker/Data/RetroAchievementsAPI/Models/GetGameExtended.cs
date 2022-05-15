using Newtonsoft.Json;

namespace RetroAchievementTracker.Data.RetroAchievementsAPI.Models
{
    public class GameInfo
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ConsoleName")]
        public string ConsoleName { get; set; }

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; }

        [JsonProperty("ImageIngame")]
        public string ImageIngame { get; set; }

        [JsonProperty("ImageBoxArt")]
        public string ImageBoxArt { get; set; }

        [JsonProperty("Genre")]
        public string Genre { get; set; }

        [JsonProperty("NumAchievements")]
        public int AchievementCount { get; set; }

        [JsonProperty("NumDistinctPlayersCasual")]
        public int PlayersCasual { get; set; }

        [JsonProperty("NumDistinctPlayersHardcore")]
        public int PlayersHardcore { get; set; }

        [JsonProperty("Achievements")]
        public Dictionary<string, Achievement>? Achievements { get; set; }
    }

    public partial class Achievement
    {
        [JsonProperty("ID")]
        public long Id { get; set; }

        [JsonProperty("NumAwarded")]
        public long NumAwarded { get; set; }

        [JsonProperty("NumAwardedHardcore")]
        public long NumAwardedHardcore { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("Points")]
        public long Points { get; set; }

        [JsonProperty("BadgeName")]
        public long BadgeName { get; set; }
    }
}
