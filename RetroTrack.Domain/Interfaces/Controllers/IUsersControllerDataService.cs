using RetroTrack.Domain.DTOs.Controllers.Users.Requests;
using RetroTrack.Domain.DTOs.Controllers.Users.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IUsersControllerDataService
    {
        Task<bool> CheckUserUpdateCompleted(int userId);
        Task<GetUserProfileResponse> GetUserProfile(string username);
        Task<RequestUserGameUpdateResponse> RequestUserGameUpdate(int userId);
        Task SaveUserGameWallPositions(int userId, SaveUserGameWallPositionsRequest request);
    }
}