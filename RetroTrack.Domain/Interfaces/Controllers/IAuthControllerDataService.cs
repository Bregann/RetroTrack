using RetroTrack.Domain.DTOs.Controllers.Auth;
using RetroTrack.Domain.OldCode.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IAuthControllerDataService
    {
        Task<ResetUserPasswordDto> ResetUserPassword(string username, string password, string raApiKey);
        Task<bool> ValidateSessionStatus(string sessionId);
        LoginUserDto ValidateUserLogin(string username, string password);
        Task<RegisterUserDto> RegisterUser(string username, string password, string raApiKey);
    }
}
