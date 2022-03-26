using Newtonsoft.Json;

namespace RetroAchievementTracker.Data.RetroAchievementsAPI.Models
{
    public class GetUserProgress
    {
        [JsonProperty("NumPossibleAchievements")]
        public int NumPossibleAchievements { get; set; }
    }
}
