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
}
