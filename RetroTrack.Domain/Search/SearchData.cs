using RetroTrack.Domain.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Search
{
    public class SearchData
    {
        public int GameId { get; set; }
        public string  Console {  get; set; }
        public string GameTitle {  get; set; }
        public string GameIconUrl { get; set; }
        public int AchievementCount { get; set; }
        public string Genre { get; set; }
        public int PlayerCount { get; set; }
    }

    public class AchievementData
    {
        public int GameId { get; set; }
        public long AchievementId { get; set; }
        public string AchievementName { get; set; }
        public string AchievementDescription { get; set; }
        public int AchievementPointValue { get; set; }
        public int AchievementDisplayOrder { get; set; }
    }
}
