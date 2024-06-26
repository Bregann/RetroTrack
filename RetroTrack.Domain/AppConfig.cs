﻿using RetroTrack.Infrastructure.Database.Context;
using Serilog;

namespace RetroTrack.Domain
{
    public class AppConfig
    {
        public static readonly string RetroAchievementsApiBaseUrl = "https://retroachievements.org/API/";
        public static string RetroAchievementsApiUsername { get; private set; } = "";
        public static string RetroAchievementsApiKey { get; private set; } = "";
        public static string HFConnectionString { get; private set; } = "";
        public static string ProjectMonitorApiKey { get; private set; } = "";
        public static string HFUsername { get; private set; } = "";
        public static string HFPassword { get; private set; } = "";
        public static string ApiSecret { get; private set; } = "";
        public static void LoadConfigFromDatabase()
        {
            using (var context = new DatabaseContext())
            {
                var config = context.Config.First();

                RetroAchievementsApiUsername = config.RetroAchievementsApiUsername;
                RetroAchievementsApiKey = config.RetroAchievementsApiKey;
                HFConnectionString = config.HFConnectionString;
                ProjectMonitorApiKey = config.ProjectMonitorApiKey;
                HFUsername = config.HangfireUsername;
                HFPassword = config.HangfirePassword;
                ApiSecret = config.ApiSecret;

                Log.Information("[App Config] Config loaded from database");
            }
        }
    }
}