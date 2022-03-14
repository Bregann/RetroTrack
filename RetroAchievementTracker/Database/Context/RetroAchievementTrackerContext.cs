using Microsoft.EntityFrameworkCore;
using RetroAchievementTracker.Database.Models;
using Serilog;

namespace RetroAchievementTracker.Database.Context
{
    public class RetroAchievementTrackerContext : DbContext
    {
        public DbSet<Achievements> Achievements { get; set; }
        public DbSet<CompletedGames> CompletedGames { get; set; }
        public DbSet<GameConsoles> GameConsoles { get; set; }
        public DbSet<Games> Games { get; set; }
        public DbSet<UserData> UserData { get; set; }
        public string DbPath { get; }

        public RetroAchievementTrackerContext()
        {
            var filePath = Directory.GetCurrentDirectory();
            DbPath = filePath + "\\Database\\retroachievements.db";
        }

        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        public static readonly ILoggerFactory SerilogFactory 
            = LoggerFactory.Create(builder => { builder.AddSerilog(); });

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options
            .UseSqlite($"Data Source={DbPath}")
            .UseLoggerFactory(SerilogFactory);

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserData>()
                .HasIndex(u => u.Username)
                .IsUnique();

            builder.Entity<GameConsoles>()
                .HasIndex(u => u.ConsoleID)
                .IsUnique();

            builder.Entity<Games>()
                .HasIndex(u => u.Id)
                .IsUnique();

            builder.Entity<CompletedGames>()
                .HasIndex(u => u.UsernameGameID)
                .IsUnique();

            builder.Entity<Achievements>()
                .HasIndex(u => u.Id)
                .IsUnique();
        }

    }
}
