using RetroTrack.Domain.DTOs.Controllers.Games;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface ITrackedGamesControllerDataService
    {
        bool AddNewTrackedGame(string username, int gameId);
        List<UserGamesTableDto> GetTrackedGamesForUser(string username);
        bool RemoveTrackedGame(string username, int gameId);
    }
}
