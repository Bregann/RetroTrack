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
        bool RemoveTrackedGame(string username, int gameId);
    }
}
