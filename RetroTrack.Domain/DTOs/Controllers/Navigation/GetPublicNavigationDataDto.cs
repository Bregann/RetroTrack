using RetroTrack.Domain.Enums;
using RetroTrack.Infrastructure.Database.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Navigation
{
    public class GetPublicNavigationDataDto
    {
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required int GameCount { get; set; }
        public required ConsoleType ConsoleType { get; set; }
    }
}
