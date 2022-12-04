using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public DateTime DateModified { get; set; }
    }

    public class GetGameExtended
    {
        [JsonProperty("ID")]
        public long Id { get; set; }

        [JsonProperty("Genre")]
        public string Genre { get; set; }

        [JsonProperty("NumDistinctPlayersHardcore")]
        public int Players { get; set; }
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
        [JsonProperty("TotalPoints")]
        public long TotalPoints { get; set; }

        [JsonProperty("Rank")]
        public long Rank { get; set; }

        [JsonProperty("UserPic")]
        public string UserPic { get; set; }

        [JsonProperty("TotalRanked")]
        public long TotalRanked { get; set; }
    }
}
