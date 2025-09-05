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
