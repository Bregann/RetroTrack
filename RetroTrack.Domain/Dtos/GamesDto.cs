using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class DayListDto
    {
        public List<PublicGamesTableDto> GamesTable { get; set; }
        public string Date { get; set; }
    }
}
