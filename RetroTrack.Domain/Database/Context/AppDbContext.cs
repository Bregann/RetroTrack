using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Models;

namespace RetroTrack.Domain.Database.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<UserGameProgress> UserGameProgress { get; set; }
        public DbSet<GameConsoles> GameConsoles { get; set; }
        public DbSet<Games> Games { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<TrackedGames> TrackedGames { get; set; }
        public DbSet<Sessions> Sessions { get; set; }
        public DbSet<Config> Config { get; set; }
        public DbSet<RetroAchievementsApiData> RetroAchievementsApiData { get; set; }
        public DbSet<DataCaching> DataCaching { get; set; }
        public DbSet<DevWishlist> DevWishlist { get; set; }
        public DbSet<UndevvedGames> UndevvedGames { get; set; }
        public DbSet<Achievements> Achievements { get; set; }
        public DbSet<EnvironmentalSetting> EnvironmentalSettings { get; set; }
    }
}