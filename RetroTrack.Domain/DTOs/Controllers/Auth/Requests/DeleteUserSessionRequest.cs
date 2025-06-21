using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Auth.Requests
{
    public class DeleteUserSessionRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
