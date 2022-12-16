namespace RetroTrack.Domain.Dtos
{
    public class DayListDto
    {
        public List<PublicGamesTableDto> GamesTable { get; set; }
        public string Date { get; set; }
    }
}