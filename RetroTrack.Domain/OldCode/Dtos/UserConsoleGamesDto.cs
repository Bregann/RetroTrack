namespace RetroTrack.Domain.OldCode.Dtos
{
    public class UserConsoleGamesDto
    {
        public required string ConsoleName { get; set; }
        public required int ConsoleId { get; set; }
        public required List<UserGamesTableDto> Games { get; set; }
    }
}