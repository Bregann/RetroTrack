using Microsoft.AspNetCore.Http;
using RetroTrack.Domain.DTOs.Helpers;

namespace RetroTrack.Domain.Interfaces.Helpers
{
    public interface IAuthHelperService
    {
        string GetRAUsernameFromLoginUsername(string username);
        UserDataDto? ValidateSessionIdAndReturnUserData(IHeaderDictionary headers);
    }
}
