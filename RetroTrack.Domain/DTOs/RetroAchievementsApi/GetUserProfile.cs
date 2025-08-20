using Newtonsoft.Json;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class GetUserProfile
    {
        [JsonProperty("User")]
        public string User { get; set; } = "";

        [JsonProperty("ULID")]
        public string Ulid { get; set; } = "";

        [JsonProperty("UserPic")]
        public string UserPic { get; set; } = "";

        [JsonProperty("MemberSince")]
        public DateTimeOffset MemberSince { get; set; }

        [JsonProperty("RichPresenceMsg")]
        public string RichPresenceMsg { get; set; } = "";

        [JsonProperty("LastGameID")]
        public long LastGameId { get; set; }

        [JsonProperty("ContribCount")]
        public long ContribCount { get; set; }

        [JsonProperty("ContribYield")]
        public long ContribYield { get; set; }

        [JsonProperty("TotalPoints")]
        public long TotalPoints { get; set; }

        [JsonProperty("TotalSoftcorePoints")]
        public long TotalSoftcorePoints { get; set; }

        [JsonProperty("TotalTruePoints")]
        public long TotalTruePoints { get; set; }

        [JsonProperty("Permissions")]
        public long Permissions { get; set; }

        [JsonProperty("Untracked")]
        public long Untracked { get; set; }

        [JsonProperty("ID")]
        public long Id { get; set; }

        [JsonProperty("UserWallActive")]
        public bool UserWallActive { get; set; }

        [JsonProperty("Motto")]
        public string Motto { get; set; } = "";
    }
}