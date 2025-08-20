using RetroTrack.Domain.DTOs.Controllers.Games.Responses;

namespace RetroTrack.Domain.DTOs.Controllers.TrackedGames.Responses
{
    public class GetUserTrackedGamesResponse
    {
        public required int TotalCount { get; set; }
        public required int TotalPages { get; set; }
        public required LoggedInConsoleGames[] Games { get; set; }
    }
}