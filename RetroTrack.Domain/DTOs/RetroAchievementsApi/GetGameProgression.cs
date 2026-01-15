using Newtonsoft.Json;
using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.RetroAchievementsApi
{
    public class GetGameProgression
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; } = "";

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ConsoleName")]
        public string ConsoleName { get; set; } = "";

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; } = "";

        [JsonProperty("NumDistinctPlayers")]
        public int NumDistinctPlayers { get; set; }

        [JsonProperty("TimesUsedInBeatMedian")]
        public int TimesUsedInBeatMedian { get; set; }

        [JsonProperty("TimesUsedInHardcoreBeatMedian")]
        public int TimesUsedInHardcoreBeatMedian { get; set; }

        [JsonProperty("MedianTimeToBeat")]
        public int MedianTimeToBeat { get; set; }

        [JsonProperty("MedianTimeToBeatHardcore")]
        public int MedianTimeToBeatHardcore { get; set; }

        [JsonProperty("TimesUsedInCompletionMedian")]
        public int TimesUsedInCompletionMedian { get; set; }

        [JsonProperty("TimesUsedInMasteryMedian")]
        public int TimesUsedInMasteryMedian { get; set; }

        [JsonProperty("MedianTimeToComplete")]
        public int MedianTimeToComplete { get; set; }

        [JsonProperty("MedianTimeToMaster")]
        public int MedianTimeToMaster { get; set; }

        [JsonProperty("NumAchievements")]
        public int NumAchievements { get; set; }

        [JsonProperty("Achievements")]
        public List<ProgressionAchievement> Achievements { get; set; } = new List<ProgressionAchievement>();
    }

    public class ProgressionAchievement
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; } = "";

        [JsonProperty("Description")]
        public string Description { get; set; } = "";

        [JsonProperty("Points")]
        public int Points { get; set; }

        [JsonProperty("TrueRatio")]
        public int TrueRatio { get; set; }

        [JsonProperty("Type")]
        public AchievementType? Type { get; set; }

        [JsonProperty("BadgeName")]
        public string BadgeName { get; set; } = "";

        [JsonProperty("NumAwarded")]
        public int NumAwarded { get; set; }

        [JsonProperty("NumAwardedHardcore")]
        public int NumAwardedHardcore { get; set; }

        [JsonProperty("TimesUsedInUnlockMedian")]
        public int TimesUsedInUnlockMedian { get; set; }

        [JsonProperty("TimesUsedInHardcoreUnlockMedian")]
        public int TimesUsedInHardcoreUnlockMedian { get; set; }

        [JsonProperty("MedianTimeToUnlock")]
        public int MedianTimeToUnlock { get; set; }

        [JsonProperty("MedianTimeToUnlockHardcore")]
        public int MedianTimeToUnlockHardcore { get; set; }
    }
}
