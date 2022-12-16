using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Infrastructure
{
    //Rename to DbSettings.cs to use
    public class DbSettingsExample
    {
#if DEBUG
        public static readonly string ConnectionString = "";
#else
        public static readonly string ConnectionString = "";
#endif
    }
}
