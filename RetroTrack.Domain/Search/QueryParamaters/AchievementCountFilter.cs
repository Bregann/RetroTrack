using RetroTrack.Domain.Search.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Search.QueryParamaters
{
    public class AchievementCountFilter
    {
        public long Value { get; set; }
        public NumberFilterEnum FilterType { get; set; } = NumberFilterEnum.EqualTo;
    }
}
