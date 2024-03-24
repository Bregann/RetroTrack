using Newtonsoft.Json;

namespace RetroTrack.Domain.Models
{
    public class ConsoleIDs
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }
    }

    public class GetGameList
    {
        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; }

        [JsonProperty("NumAchievements")]
        public int AchievementCount { get; set; }

        [JsonProperty("Points")]
        public int Points { get; set; }

        [JsonProperty("DateModified")]
        public DateTime? DateModified { get; set; }
    }

    public class GetUserCompletedGames
    {
        [JsonProperty("GameID")]
        public int GameId { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("NumAwarded")]
        public int AchievementsAwarded { get; set; }

        [JsonProperty("HardcoreMode")]
        public int HardcoreMode { get; set; }

        [JsonProperty("PctWon")]
        public double? PctWon { get; set; }
    }

    public class GetUserSummary
    {
        [JsonProperty("User")]
        public string User { get; set; }

        [JsonProperty("TotalPoints")]
        public long TotalPoints { get; set; }

        [JsonProperty("Rank")]
        public long? Rank { get; set; }

        [JsonProperty("UserPic")]
        public string UserPic { get; set; }

        [JsonProperty("TotalRanked")]
        public long TotalRanked { get; set; }

        [JsonProperty("LastActivity")]
        public LastActivity LastActivity { get; set; }
    }

    public class LastActivity
    {
        [JsonProperty("User")]
        public string User { get; set; }
    }

    public class GetGameExtended
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ConsoleName")]
        public string ConsoleName { get; set; }

        [JsonProperty("ImageIngame")]
        public string ImageInGame { get; set; }

        [JsonProperty("ImageBoxArt")]
        public string ImageBoxArt { get; set; }

        [JsonProperty("Genre")]
        public string Genre { get; set; }

        [JsonProperty("NumAchievements")]
        public int AchievementCount { get; set; }

        [JsonProperty("NumDistinctPlayersCasual")]
        public int Players { get; set; }

        [JsonProperty("Updated")]
        public DateTime Updated { get; set; }

        [JsonProperty("Achievements")]
        public Dictionary<string, Achievement>? Achievements { get; set; }
    }

    public partial class Achievement
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
        public int Points { get; set; }

        [JsonProperty("BadgeName")]
        public string BadgeName { get; set; }

        [JsonProperty("DisplayOrder")]
        public int DisplayOrder { get; set; }
    }

    public class GetGameInfoAndUserProgress
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ForumTopicID")]
        public int ForumTopicId { get; set; }

        [JsonProperty("Flags")]
        public int Flags { get; set; }

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; }

        [JsonProperty("ImageTitle")]
        public string ImageTitle { get; set; }

        [JsonProperty("ImageIngame")]
        public string ImageInGame { get; set; }

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
        public int AchievementCount { get; set; }

        [JsonProperty("NumDistinctPlayersCasual")]
        public int Players { get; set; }

        [JsonProperty("Achievements")]
        public Dictionary<string, UserAchievement> Achievements { get; set; }

        [JsonProperty("NumAwardedToUser")]
        public int NumAwardedToUser { get; set; }

        [JsonProperty("UserCompletion")]
        public string UserCompletion { get; set; }

        [JsonProperty("UserCompletionHardcore")]
        public string UserCompletionHardcore { get; set; }
    }

    public class UserAchievement
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("NumAwarded")]
        public int NumAwarded { get; set; }

        [JsonProperty("NumAwardedHardcore")]
        public int NumAwardedHardcore { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("Points")]
        public int Points { get; set; }

        [JsonProperty("DateModified")]
        public DateTimeOffset DateModified { get; set; }

        [JsonProperty("DateCreated")]
        public DateTimeOffset DateCreated { get; set; }

        [JsonProperty("BadgeName")]
        public string BadgeName { get; set; }

        [JsonProperty("DisplayOrder")]
        public int DisplayOrder { get; set; }

        [JsonProperty("DateEarned", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? DateEarned { get; set; }

        [JsonProperty("DateEarnedHardcore", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? DateEarnedHardcore { get; set; }

        [JsonProperty("type")]
        public TypeEnum? Type { get; set; }
    }

    public enum TypeEnum { Missable, Progression, Win_Condition, Unknown };

    public partial class GetActiveClaims
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("User")]
        public string User { get; set; }

        [JsonProperty("GameID")]
        public long GameId { get; set; }
    }
}