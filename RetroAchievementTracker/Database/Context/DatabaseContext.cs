using Microsoft.EntityFrameworkCore;
using RetroAchievementTracker.Database.Models;

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

#if DEBUG
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql("Host=localhost;Database=retroachievements;Username=ra;Password=yourpassword");
#else
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql("Host=localhost;Database=retroachievements;Username=ra;Password=yourpassword");
#endif
    }
}
