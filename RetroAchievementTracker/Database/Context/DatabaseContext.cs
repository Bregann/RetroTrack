using Microsoft.EntityFrameworkCore;
using RetroAchievementTracker.Database.Models;
using Serilog;

namespace RetroAchievementTracker.Database.Context
{
    public class DatabaseContext : DbContext
    {
        public DbSet<UserGameProgress> UserGameProgress { get; set; }
        public DbSet<GameConsoles> GameConsoles { get; set; }
        public DbSet<Games> Games { get; set; }
        public DbSet<UserData> UserData { get; set; }
        public DbSet<GameCounts> GameCounts { get; set; }
        public DbSet<TrackedGames> TrackedGames { get; set; }
        public string DbPath { get; }

        public DatabaseContext()
        {
            var filePath = Directory.GetCurrentDirectory();
#if DEBUG
            DbPath = filePath + "\\Database\\retroachievements.db";
#else
            DbPath = filePath + "/Database/retroachievements.db";
#endif
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options
            .UseSqlite($"Data Source={DbPath}");
    }
}
