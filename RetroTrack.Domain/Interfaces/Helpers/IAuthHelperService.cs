using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces.Helpers
{
    public interface IAuthHelperService
    {
        string GetRAUsernameFromLoginUsername(string username);
        string? ValidateSessionIdAndReturnUsername(IHeaderDictionary headers);
    }
}
