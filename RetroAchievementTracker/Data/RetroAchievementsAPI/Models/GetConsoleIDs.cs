using Newtonsoft.Json;

namespace RetroAchievementTracker.Data.RetroAchievementsAPI.Models
{
    public class ConsoleIDs
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }
    }
}
