using Microsoft.EntityFrameworkCore;
using RetroTrack.Infrastructure.Database.Models;

namespace RetroTrack.Infrastructure.Database.Context
{
    public class DatabaseContext : DbContext
    {
#if DEBUG
        private static readonly string _connectionString = "";
#else
        private static readonly string _connectionString = "";
#endif

        public DbSet<UserGameProgress> UserGameProgress { get; set; }
        public DbSet<GameConsoles> GameConsoles { get; set; }
        public DbSet<Games> Games { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<GameCounts> GameCounts { get; set; }
        public DbSet<TrackedGames> TrackedGames { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql(_connectionString);
    }
}