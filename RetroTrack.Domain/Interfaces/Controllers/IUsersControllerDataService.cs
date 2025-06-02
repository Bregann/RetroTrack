using RetroTrack.Domain.DTOs.Controllers.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IUsersControllerDataService
    {
        bool CheckUserUpdateCompleted(string username);
        void DeleteUserSession(string sessionId);
        UpdateUserGamesDto UpdateUserGames(string username);
    }
}
