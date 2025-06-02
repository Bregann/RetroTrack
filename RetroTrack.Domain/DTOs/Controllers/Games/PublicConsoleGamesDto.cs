namespace RetroTrack.Domain.DTOs.Controllers.Games
{
    public class PublicConsoleGamesDto
    {
        public required string ConsoleName { get; set; }
        public required int ConsoleId { get; set; }
        public required List<PublicGamesTableDto> Games { get; set; }
    }
}