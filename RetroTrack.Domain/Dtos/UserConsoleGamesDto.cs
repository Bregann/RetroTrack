using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class UserConsoleGamesDto
    {
        public required string ConsoleName { get; set; }
        public required int ConsoleId { get; set; }
        public required List<UserGamesTableDto> Games { get; set; }
    }
}
