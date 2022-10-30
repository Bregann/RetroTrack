using Microsoft.EntityFrameworkCore;
using RetroAchievementTracker.Database.Models;

namespace RetroAchievementTracker.Database.Context
{
    public class DatabaseContext : DbContext
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

        public DbSet<UserGameProgress> UserGameProgress { get; set; }
        public DbSet<GameConsoles> GameConsoles { get; set; }
        public DbSet<Games> Games { get; set; }
        public DbSet<UserData> UserData { get; set; }
        public DbSet<GameCounts> GameCounts { get; set; }
        public DbSet<TrackedGames> TrackedGames { get; set; }
        public string DbPath { get; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql($"Host={DbHost};Database=retroachievements;Username={DbUsername};Password={DbPassword}");
    }
}
