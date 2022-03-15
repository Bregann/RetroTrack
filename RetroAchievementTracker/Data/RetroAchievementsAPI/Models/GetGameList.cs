using Newtonsoft.Json;

namespace RetroAchievementTracker.Data.RetroAchievementsAPI.Models
{
    public class GameList
    {
        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleID { get; set; }

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; }
    }
}
