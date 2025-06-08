using RetroTrack.Domain.DTOs.Controllers.Users;
using RetroTrack.Domain.DTOs.Helpers;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IUsersControllerDataService
    {
        Task<bool> CheckUserUpdateCompleted(UserDataDto userData);
        Task<UpdateUserGamesDto> UpdateUserGames(UserDataDto userData);
    }
}
