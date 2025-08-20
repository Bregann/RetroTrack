using Newtonsoft.Json;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class ConsoleIDs
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; } = "";
    }
}