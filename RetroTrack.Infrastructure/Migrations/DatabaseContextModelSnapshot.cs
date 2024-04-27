﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using RetroTrack.Infrastructure.Database.Context;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Achievements", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("AchievementDescription")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("AchievementIcon")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("AchievementName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("DisplayOrder")
                        .HasColumnType("integer");

                    b.Property<int>("GameId")
                        .HasColumnType("integer");

                    b.Property<int>("Points")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.ToTable("Achievements");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Config", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ApiSecret")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("HFConnectionString")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("HangfirePassword")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("HangfireUsername")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ProjectMonitorApiKey")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RetroAchievementsApiKey")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RetroAchievementsApiUsername")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Config");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            ApiSecret = "",
                            HFConnectionString = "",
                            HangfirePassword = "",
                            HangfireUsername = "",
                            ProjectMonitorApiKey = "",
                            RetroAchievementsApiKey = "",
                            RetroAchievementsApiUsername = ""
                        });
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.DataCaching", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("CacheData")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("CacheName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("LastUpdate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("MinutesToCacheFor")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("DataCaching");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.DevWishlist", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("GameId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.HasIndex("Username");

                    b.ToTable("DevWishlist");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.GameConsoles", b =>
                {
                    b.Property<int>("ConsoleID")
                        .HasColumnType("integer");

                    b.Property<string>("ConsoleName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("ConsoleType")
                        .HasColumnType("integer");

                    b.Property<bool>("DisplayOnSite")
                        .HasColumnType("boolean");

                    b.Property<int>("GameCount")
                        .HasColumnType("integer");

                    b.Property<int>("NoAchievementsGameCount")
                        .HasColumnType("integer");

                    b.HasKey("ConsoleID");

                    b.ToTable("GameConsoles");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Games", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<int>("AchievementCount")
                        .HasColumnType("integer");

                    b.Property<int>("ConsoleID")
                        .HasColumnType("integer");

                    b.Property<bool>("DiscordMessageProcessed")
                        .HasColumnType("boolean");

                    b.Property<bool>("EmailMessageProcessed")
                        .HasColumnType("boolean");

                    b.Property<bool>("ExtraDataProcessed")
                        .HasColumnType("boolean");

                    b.Property<string>("GameGenre")
                        .HasColumnType("text");

                    b.Property<string>("ImageIcon")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("LastModified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("Players")
                        .HasColumnType("integer");

                    b.Property<int>("Points")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ConsoleID");

                    b.ToTable("Games");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.RetroAchievementsApiData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ApiRequestType")
                        .HasColumnType("integer");

                    b.Property<int>("FailedProcessingAttempts")
                        .HasColumnType("integer");

                    b.Property<string>("JsonData")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("LastUpdate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("ProcessingStatus")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("RetroAchievementsApiData");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Sessions", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("text");

                    b.Property<DateTime>("ExpiryTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("SessionId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Username");

                    b.ToTable("Sessions");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.TrackedGames", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("GameId")
                        .HasColumnType("integer");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.HasIndex("Username");

                    b.ToTable("TrackedGames");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.UndevvedGames", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<string>("Developer")
                        .HasColumnType("text");

                    b.Property<int>("GameConsoleConsoleID")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("GameConsoleConsoleID");

                    b.ToTable("UndevvedGames");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.UserGameProgress", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("AchievementsGained")
                        .HasColumnType("integer");

                    b.Property<int>("AchievementsGainedHardcore")
                        .HasColumnType("integer");

                    b.Property<int>("GameId")
                        .HasColumnType("integer");

                    b.Property<double>("GamePercentage")
                        .HasColumnType("double precision");

                    b.Property<double>("GamePercentageHardcore")
                        .HasColumnType("double precision");

                    b.Property<DateTime?>("HighestAwardDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("HighestAwardKind")
                        .HasColumnType("integer");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.HasIndex("Username");

                    b.ToTable("UserGameProgress");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Users", b =>
                {
                    b.Property<string>("Username")
                        .HasColumnType("text");

                    b.Property<string>("HashedPassword")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("LastAchievementsUpdate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastActivity")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastUserUpdate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("RAUsername")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("UserPoints")
                        .HasColumnType("bigint");

                    b.Property<string>("UserProfileUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("UserRank")
                        .HasColumnType("bigint");

                    b.HasKey("Username");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Achievements", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Games", "Game")
                        .WithMany()
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.DevWishlist", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.DevWishlist", "Game")
                        .WithMany()
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Users", "User")
                        .WithMany("DevWishlist")
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Games", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.GameConsoles", "GameConsole")
                        .WithMany()
                        .HasForeignKey("ConsoleID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GameConsole");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Sessions", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Users", "User")
                        .WithMany("Sessions")
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.TrackedGames", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Games", "Game")
                        .WithMany()
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Users", "User")
                        .WithMany("TrackedGames")
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.UndevvedGames", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.GameConsoles", "GameConsole")
                        .WithMany()
                        .HasForeignKey("GameConsoleConsoleID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GameConsole");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.UserGameProgress", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Games", "Game")
                        .WithMany()
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Users", "User")
                        .WithMany()
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Users", b =>
                {
                    b.Navigation("DevWishlist");

                    b.Navigation("Sessions");

                    b.Navigation("TrackedGames");
                });
#pragma warning restore 612, 618
        }
    }
}
