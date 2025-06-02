using Microsoft.AspNetCore.Http;

namespace RetroTrack.Domain.Interfaces.Helpers
{
    public interface IAuthHelperService
    {
        string GetRAUsernameFromLoginUsername(string username);
        string? ValidateSessionIdAndReturnUsername(IHeaderDictionary headers);
    }
}
