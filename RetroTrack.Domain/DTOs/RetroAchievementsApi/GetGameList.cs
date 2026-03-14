using Newtonsoft.Json;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class GetGameList
    {
        [JsonProperty("Title")]
        public string Title { get; set; } = "";

        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ConsoleName")]
        public string ConsoleName { get; set; } = "";

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; } = "";

        [JsonProperty("NumAchievements")]
        public int AchievementCount { get; set; }

        [JsonProperty("NumLeaderboards")]
        public int LeaderboardCount { get; set; }

        [JsonProperty("Points")]
        public int Points { get; set; }

        [JsonProperty("DateModified")]
        public DateTime? DateModified { get; set; }

        [JsonProperty("ForumTopicID")]
        public int? ForumTopicId { get; set; }

        [JsonProperty("Hashes")]
        public List<string> Hashes { get; set; } = new();
    }
}
