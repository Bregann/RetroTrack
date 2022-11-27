using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class UpdateUserGamesDto
    {
        public bool Success { get; set; }
        public string Reason { get; set; }
    }
}