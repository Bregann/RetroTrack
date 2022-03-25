using Newtonsoft.Json;

namespace RetroAchievementTracker.Data.RetroAchievementsAPI.Models
{
    public class GetGameInfoAndUserProgress
    {
        [JsonProperty("ID")]
        public long Id { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("ConsoleID")]
        public long ConsoleId { get; set; }

        [JsonProperty("ForumTopicID")]
        public long ForumTopicId { get; set; }

        [JsonProperty("Flags")]
        public long Flags { get; set; }

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; }

        [JsonProperty("ImageTitle")]
        public string ImageTitle { get; set; }

        [JsonProperty("ImageIngame")]
        public string ImageIngame { get; set; }

        [JsonProperty("ImageBoxArt")]
        public string ImageBoxArt { get; set; }

        [JsonProperty("Publisher")]
        public string Publisher { get; set; }

        [JsonProperty("Developer")]
        public string Developer { get; set; }

        [JsonProperty("Genre")]
        public string Genre { get; set; }

        [JsonProperty("Released")]
        public string Released { get; set; }

        [JsonProperty("IsFinal")]
        public bool IsFinal { get; set; }

        [JsonProperty("ConsoleName")]
        public string ConsoleName { get; set; }

        [JsonProperty("RichPresencePatch")]
        public string RichPresencePatch { get; set; }

        [JsonProperty("NumAchievements")]
        public long NumAchievements { get; set; }

        [JsonProperty("NumDistinctPlayersCasual")]
        public long NumDistinctPlayersCasual { get; set; }

        [JsonProperty("NumDistinctPlayersHardcore")]
        public long NumDistinctPlayersHardcore { get; set; }

        [JsonProperty("Achievements")]
        public Dictionary<string, UserAchievement> Achievements { get; set; }

        [JsonProperty("NumAwardedToUser")]
        public long NumAwardedToUser { get; set; }

        [JsonProperty("UserCompletion")]
        public string UserCompletion { get; set; }

        [JsonProperty("UserCompletionHardcore")]
        public string UserCompletionHardcore { get; set; }
    }

    public class UserAchievement
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

        [JsonProperty("DateModified")]
        public DateTimeOffset DateModified { get; set; }

        [JsonProperty("DateCreated")]
        public DateTimeOffset DateCreated { get; set; }

        [JsonProperty("BadgeName")]
        public long BadgeName { get; set; }

        [JsonProperty("DisplayOrder")]
        public long DisplayOrder { get; set; }

        [JsonProperty("DateEarned", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? DateEarned { get; set; }

        [JsonProperty("DateEarnedHardcore", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? DateEarnedHardcore { get; set; }
    }
}
