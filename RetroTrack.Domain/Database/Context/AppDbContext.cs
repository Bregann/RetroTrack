using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Models;

namespace RetroTrack.Domain.Database.Context
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<UserGameProgress> UserGameProgress { get; set; }
        public DbSet<GameConsole> GameConsoles { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TrackedGame> TrackedGames { get; set; }
        public DbSet<UserRefreshToken> UserRefreshTokens { get; set; }
        public DbSet<RetroAchievementsLogAndLoadData> RetroAchievementsLogAndLoadData { get; set; }
        public DbSet<RetroAchievementsLogAndLoadError> RetroAchievementsLogAndLoadErrors { get; set; }
        public DbSet<DataCaching> DataCaching { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<EnvironmentalSetting> EnvironmentalSettings { get; set; }
    }
}