
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos.Public
{
    public class LoginUserDto
    {
        public required bool Successful { get; set; }
        public string SessionId { get; set; } = "";
    }

    public class RegisterUserDto
    {
        public required bool Successful { get; set; }
        public string? Reason { get; set; }
    }
}
