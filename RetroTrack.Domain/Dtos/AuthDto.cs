
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class LoginUserDto
    {
        public required bool Successful { get; set; }
        public string SessionId { get; set; } = "";
        public string Username { get; set; }
    }

    public class RegisterUserDto
    {
        public required bool Successful { get; set; }
        public string? Reason { get; set; }
    }
}
