using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Navigation.Responses
{
    public class GetPublicNavigationDataResponse
    {
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required int GameCount { get; set; }
        public required ConsoleType ConsoleType { get; set; }
    }
}
