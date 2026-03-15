using Newtonsoft.Json;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class GetGameHashes
    {
        [JsonProperty("Results")]
        public List<GameHash> Results { get; set; } = new();
    }

    public class GameHash
    {
        [JsonProperty("MD5")]
        public string Md5 { get; set; } = "";

        [JsonProperty("Name")]
        public string Name { get; set; } = "";

        [JsonProperty("Labels")]
        public List<string> Labels { get; set; } = new();

        [JsonProperty("PatchUrl")]
        public string? PatchUrl { get; set; }
    }
}
