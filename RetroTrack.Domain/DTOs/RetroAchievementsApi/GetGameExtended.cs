using Newtonsoft.Json;
using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class GetGameExtended
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; } = "";

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ConsoleName")]
        public string ConsoleName { get; set; } = "";
        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; } = "";

        [JsonProperty("ImageIngame")]
        public string ImageInGame { get; set; } = "";

        [JsonProperty("ImageTitle")]
        public string ImageTitle { get; set; } = "";

        [JsonProperty("ImageBoxArt")]
        public string ImageBoxArt { get; set; } = "";

        [JsonProperty("Publisher")]
        public string Publisher { get; set; } = "";

        [JsonProperty("Developer")]
        public string Developer { get; set; } = "";

        [JsonProperty("Genre")]
        public string Genre { get; set; } = "";

        [JsonProperty("NumAchievements")]
        public int AchievementCount { get; set; }

        [JsonProperty("NumDistinctPlayersCasual")]
        public int Players { get; set; }

        [JsonProperty("ParentGameID")]
        public int? ParentGameId { get; set; }

        [JsonProperty("Updated")]
        public DateTime Updated { get; set; }

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
        public string Title { get; set; } = "";

        [JsonProperty("Description")]
        public string Description { get; set; } = "";

        [JsonProperty("Points")]
        public int Points { get; set; }

        [JsonProperty("BadgeName")]
        public string BadgeName { get; set; } = "";

        [JsonProperty("DisplayOrder")]
        public int DisplayOrder { get; set; }

        [JsonProperty("type")]
        public AchievementType? Type { get; set; }

        [JsonProperty("Author")]
        public string Author { get; set; } = "";

        [JsonProperty("DateCreated")]
        public DateTime DateCreated { get; set; }

        [JsonProperty("DateModified")]
        public DateTime DateModified { get; set; }
    }
}
