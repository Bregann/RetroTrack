using RetroTrack.Domain.Search.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Search.QueryParamaters
{
    public class NameFilter
    {
        public string Value { get; set; } = "";
        public IncludeExcludeEnum FilterType { get; set; } = IncludeExcludeEnum.Includes;
    }
}
