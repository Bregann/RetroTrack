using RetroTrack.Domain.DTOs.Controllers.Users;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IUsersControllerDataService
    {
        bool CheckUserUpdateCompleted(string username);
        void DeleteUserSession(string sessionId);
        UpdateUserGamesDto UpdateUserGames(string username);
    }
}
