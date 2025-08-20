using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.DTOs.Controllers.Users.Requests
{
    public class SaveUserGameWallPositionsRequest
    {
        public required WallData[] WallData { get; set; }
    }

    public class WallData
    {
        public required int ProgressId { get; set; }
        public required int WallPosition { get; set; }
    }
}
