using RetroTrack.Domain.Search.QueryParamaters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Search
{
    public class QueryData
    {
        public List<NameFilter> NameFilters { get; set; } = new List<NameFilter>();
        public List<AchievementCountFilter> AchievementCountFilters { get; set; } = new List<AchievementCountFilter>();
    }
}
