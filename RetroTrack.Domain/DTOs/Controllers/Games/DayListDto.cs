namespace RetroTrack.Domain.DTOs.Controllers.Games
{
    public class DayListDto
    {
        public List<PublicGamesTableDto> GamesTable { get; set; }
        public string Date { get; set; }
    }
}