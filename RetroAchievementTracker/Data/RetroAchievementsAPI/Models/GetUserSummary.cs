using Newtonsoft.Json;

namespace RetroAchievementTracker.Data.RetroAchievementsAPI.Models
{
    public class GetUserSummary
    {
        [JsonProperty("MemberSince")]
        public DateTimeOffset MemberSince { get; set; }

        [JsonProperty("TotalPoints")]
        public long TotalPoints { get; set; }

        [JsonProperty("Rank")]
        public long Rank { get; set; }

        [JsonProperty("TotalRanked")]
        public long TotalRanked { get; set; }

        [JsonProperty("UserPic")]
        public string UserPic { get; set; }

        public int GamesCompleted { get; set; } //not from the API but from db
    }
}
