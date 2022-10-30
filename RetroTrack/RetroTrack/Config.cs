namespace RetroTrack.Api
{
    public class Config
    {
#if DEBUG
        public static readonly string DbHost = "";
        public static readonly string DbUsername = "";
        public static readonly string DbPassword = "";

#else
        public static readonly string DbHost = "";
        public static readonly string DbUsername = "";
        public static readonly string DbPassword = "";
#endif

        public static readonly string SendgridApiKey = "";
        public static readonly string RetroAchievementsApiKey = "";
        public static readonly string RetroAchievementsBaseUrl = "";
    }
}
