using Newtonsoft.Json;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class GetGame
    {
        [JsonProperty("Title")]
        public string Title { get; set; } = "";

        [JsonProperty("GameTitle")]
        public string GameTitle { get; set; } = "";

        [JsonProperty("ConsoleID")]
        public long ConsoleId { get; set; }

        [JsonProperty("ConsoleName")]
        public string ConsoleName { get; set; } = "";

        [JsonProperty("Console")]
        public string Console { get; set; } = "";

        [JsonProperty("ForumTopicID")]
        public long? ForumTopicId { get; set; }

        [JsonProperty("Flags")]
        public long Flags { get; set; }

        [JsonProperty("GameIcon")]
        public string GameIcon { get; set; } = "";

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; } = "";

        [JsonProperty("ImageTitle")]
        public string ImageTitle { get; set; } = "";

        [JsonProperty("ImageIngame")]
        public string ImageIngame { get; set; } = "";

        [JsonProperty("ImageBoxArt")]
        public string ImageBoxArt { get; set; } = "";

        [JsonProperty("Publisher")]
        public string Publisher { get; set; } = "";

        [JsonProperty("Developer")]
        public string Developer { get; set; } = "";

        [JsonProperty("Genre")]
        public string Genre { get; set; } = "";

        [JsonProperty("Released")]
        public DateTimeOffset? Released { get; set; }

        [JsonProperty("ReleasedAtGranularity")]
        public string ReleasedAtGranularity { get; set; } = "";
    }
}
