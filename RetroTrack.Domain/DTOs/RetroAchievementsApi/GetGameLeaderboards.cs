using Newtonsoft.Json;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class GetGameLeaderboards
    {
        [JsonProperty("Count")]
        public int Count { get; set; }

        [JsonProperty("Total")]
        public int Total { get; set; }

        [JsonProperty("Results")]
        public List<GetGameLeaderboardsResult> Results { get; set; } = [];
    }

    public class GetGameLeaderboardsResult
    {
        [JsonProperty("ID")]
        public long Id { get; set; }

        [JsonProperty("RankAsc")]
        public bool RankAsc { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; } = "";

        [JsonProperty("Description")]
        public string Description { get; set; } = "";

        [JsonProperty("TopEntry")]
        public TopEntry TopEntry { get; set; } = new TopEntry();

        [JsonProperty("Author")]
        public string Author { get; set; } = "";

        [JsonProperty("AuthorULID")]
        public string AuthorUlid { get; set; } = "";
    }

    public partial class TopEntry
    {
        [JsonProperty("User")]
        public string User { get; set; } = "";

        [JsonProperty("ULID")]
        public string Ulid { get; set; } = "";

        [JsonProperty("Score")]
        public long Score { get; set; }

        [JsonProperty("FormattedScore")]
        public string FormattedScore { get; set; } = "";
    }
}
