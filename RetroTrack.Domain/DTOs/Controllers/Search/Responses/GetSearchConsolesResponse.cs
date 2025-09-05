using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Search.Responses
{
    public class GetSearchConsolesResponse
    {
        public required List<SearchConsoleItem> Consoles { get; set; }
    }

    public class SearchConsoleItem
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
    }
}
