using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Search
{
    public class QueryResponse
    {
        public int MininumItemNumber { get; set; } = 0;
        public SearchData[] Results { get; set; } = new SearchData[0];
        public bool MoreItems { get; set; } = false;
        public int NumberOfGames { get; set; }
    }
}
