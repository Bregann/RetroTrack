using Microsoft.EntityFrameworkCore;
using RetroTrack.Api.Database.Models;

namespace RetroTrack.Api.Database.Context
{
    public class DatabaseContext : DbContext
    {
        public DbSet<UserGameProgress> UserGameProgress { get; set; }
        public DbSet<GameConsoles> GameConsoles { get; set; }
        public DbSet<Games> Games { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<GameCounts> GameCounts { get; set; }
        public DbSet<TrackedGames> TrackedGames { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql($"Host={Config.DbHost};Database=retrotrack;Username={Config.DbUsername};Password={Config.DbPassword}");
    }

}
