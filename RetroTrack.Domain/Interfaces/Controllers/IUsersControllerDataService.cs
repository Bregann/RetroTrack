using RetroTrack.Domain.DTOs.Controllers.Users.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IUsersControllerDataService
    {
        Task<bool> CheckUserUpdateCompleted(int userId);
        Task<RequestUserGameUpdateResponse> RequestUserGameUpdate(int userId);
    }
}
