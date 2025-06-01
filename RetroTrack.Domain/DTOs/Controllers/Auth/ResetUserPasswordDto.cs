using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Auth
{
    public class ResetUserPasswordDto
    {
        public required bool Success { get; set; }
        public string? Reason { get; set; }
    }
}
