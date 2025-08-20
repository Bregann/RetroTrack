using RetroTrack.Domain.DTOs.Controllers.Auth.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IAuthControllerDataService
    {
        Task ResetUserPassword(string raUsername, string password, string raApiKey);
        Task<LoginUserResponseDto> LoginUser(string username, string password);
        Task<string> RefreshToken(string token);
        Task RegisterUser(string username, string password, string raApiKey);
        Task DeleteUserSession(string sessionId);
    }
}
