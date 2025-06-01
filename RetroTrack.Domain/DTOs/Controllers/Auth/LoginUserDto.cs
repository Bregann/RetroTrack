using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Auth
{
    public class LoginUserDto
    {
        public required bool Successful { get; set; }
        public string SessionId { get; set; } = "";
        public string Username { get; set; } = "";
    }
}
