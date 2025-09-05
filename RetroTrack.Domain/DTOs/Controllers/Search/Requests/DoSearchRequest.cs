using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.DTOs.Controllers.Search.Requests
{
    public class DoSearchRequest
    {
        public required string SearchTerm { get; set; }
        public required OrderByType OrderBy { get; set; }
        public required int ConsoleId { get; set; }
        public required int Skip { get; set; }
        public required int Take { get; set; }
    }
}
