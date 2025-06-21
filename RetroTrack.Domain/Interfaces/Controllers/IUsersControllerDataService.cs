using RetroTrack.Domain.DTOs.Controllers.Users;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IUsersControllerDataService
    {
        Task<bool> CheckUserUpdateCompleted(int userId);
        Task<UpdateUserGamesDto> UpdateUserGames(int userId);
    }
}
