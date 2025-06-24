using Newtonsoft.Json;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class GetUserCompletionProgress
    {
        [JsonProperty("Count")]
        public long Count { get; set; }

        [JsonProperty("Total")]
        public long Total { get; set; }

        [JsonProperty("Results")]
        public List<Result> Results { get; set; } = [];
    }

    public class Result
    {
        [JsonProperty("GameID")]
        public int GameId { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; } = string.Empty;

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; } = string.Empty;

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ConsoleName")]
        public string ConsoleName { get; set; } = string.Empty;

        [JsonProperty("MaxPossible")]
        public int MaxPossible { get; set; }

        [JsonProperty("NumAwarded")]
        public int NumAwarded { get; set; }

        [JsonProperty("NumAwardedHardcore")]
        public int NumAwardedHardcore { get; set; }

        [JsonProperty("MostRecentAwardedDate")]
        public DateTimeOffset? MostRecentAwardedDate { get; set; }

        [JsonProperty("HighestAwardKind")]
        public string? HighestAwardKind { get; set; }

        [JsonProperty("HighestAwardDate")]
        public DateTimeOffset? HighestAwardDate { get; set; }
    }
}
