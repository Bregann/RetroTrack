namespace RetroTrack.Domain.DTOs.Controllers.Games
{
    public class UserConsoleGamesDto
    {
        public required string ConsoleName { get; set; }
        public required int ConsoleId { get; set; }
        public required List<UserGamesTableDto> Games { get; set; }
    }
}