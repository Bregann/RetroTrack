using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Infrastructure.Database.Enums
{
    public enum ProcessingStatus
    {
        NotScheduled = 1,
        Scheduled = 2,
        BeingProcessed = 3,
        Processed = 4,
        Errored = 5,
    }
}
