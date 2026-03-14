namespace RetroTrack.Domain.DTOs.Controllers.Library.Responses
{
    public class ValidateGameHashesResponse
    {
        public required HashMatch[] Matches { get; set; }
    }

    public class HashMatch
    {
        public required string Md5 { get; set; }
        public required int GameId { get; set; }
        public required string Title { get; set; }
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
        public required string ImageIcon { get; set; }
        public required string ImageBoxArt { get; set; }
    }
}
