using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Models;

namespace RetroTrack.Controllers.Games
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        [HttpGet("GetRecentlyAddedAndUpdatedGames")]
        public List<DayListDto> GetRecentlyAddedAndUpdatedGames()
        {
            return Domain.Data.Public.Games.Games.GetNewAndUpdatedGamesFromLast5Days();
        }

        [HttpGet("GetSpecificGameInfo")]
        public async Task<ActionResult<GameInfoDto>> GetSpecificGameInfo(int gameId)
        {
            var data = await Domain.Data.Public.Games.Games.GetSpecificGameInfo(gameId);

            if (data == null)
            {
                return BadRequest();
            }

            return Ok(data);
        }
    }
}
