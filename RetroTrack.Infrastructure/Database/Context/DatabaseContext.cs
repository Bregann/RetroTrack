﻿using Microsoft.EntityFrameworkCore;
using RetroTrack.Infrastructure.Database.Models;

namespace RetroTrack.Infrastructure.Database.Context
{
    public class DatabaseContext : DbContext
    {
        private static readonly string _connectionString = Environment.GetEnvironmentVariable("RetroTrackConnString");

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
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_connectionString);
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Seed in the data
            modelBuilder.Entity<Config>().HasData(new Config
            {
                Id = 1,
                RetroAchievementsApiKey = "",
                RetroAchievementsApiUsername = "",
                HFConnectionString = "",
                ProjectMonitorApiKey = "",
                HangfirePassword = "",
                HangfireUsername = "",
                ApiSecret = ""
            });
        }
    }
}