using RetroTrack.Domain.DTOs.Controllers.Auth;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IAuthControllerDataService
    {
        Task<ResetUserPasswordDto> ResetUserPassword(string raUsername, string password, string raApiKey);
        Task<bool> ValidateSessionStatus(string sessionId);
        Task<LoginUserDto> ValidateUserLogin(string username, string password);
        Task<RegisterUserDto> RegisterUser(string username, string password, string raApiKey);
        Task DeleteUserSession(string sessionId);
    }
}
