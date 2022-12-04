using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Dtos;

namespace RetroTrack.Controllers.Games
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        [HttpGet("GetRecentlyAddedAndUpdatedGames")]
        public List<DayList> GetRecentlyAddedAndUpdatedGames()
        {
            return Domain.Data.Public.Games.Games.GetNewAndUpdatedGamesFromLast5Days();
        }
    }
}
