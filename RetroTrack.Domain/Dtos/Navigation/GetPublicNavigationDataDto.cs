using RetroTrack.Infrastructure.Database.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos.Navigation
{
    public class GetPublicNavigationDataDto
    {
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required int GameCount { get; set; }
        public required ConsoleType ConsoleType { get; set; }
    }
}
