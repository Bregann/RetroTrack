﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using RetroTrack.Infrastructure.Database.Context;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20221203185720_AddGameConseoleFKToGames")]
    partial class AddGameConseoleFKToGames
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Config", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("HFConnectionString")
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
                            HFConnectionString = "",
                            RetroAchievementsApiKey = "",
                            RetroAchievementsApiUsername = ""
                        });
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.GameConsoles", b =>
                {
                    b.Property<int>("ConsoleID")
                        .HasColumnType("integer");

                    b.Property<string>("ConsoleName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("GameCount")
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

                    b.Property<bool>("DiscordMessageProcessed")
                        .HasColumnType("boolean");

                    b.Property<bool>("EmailMessageProcessed")
                        .HasColumnType("boolean");

                    b.Property<bool>("ExtraDataProcessed")
                        .HasColumnType("boolean");

                    b.Property<int>("GameConsoleConsoleID")
                        .HasColumnType("integer");

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

                    b.HasIndex("GameConsoleConsoleID");

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
                        .ValueGeneratedOnAdd()
                        .HasColumnType("text");

                    b.Property<int>("GameID")
                        .HasColumnType("integer");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Username");

                    b.ToTable("TrackedGames");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.UserGameProgress", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("AchievementsGained")
                        .HasColumnType("integer");

                    b.Property<int>("ConsoleID")
                        .HasColumnType("integer");

                    b.Property<int>("GameID")
                        .HasColumnType("integer");

                    b.Property<string>("GameName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("GamePercentage")
                        .HasColumnType("double precision");

                    b.Property<int>("HardcoreMode")
                        .HasColumnType("integer");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

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

                    b.Property<DateTime>("LastActivity")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastUserUpdate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Username");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Games", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.GameConsoles", "GameConsole")
                        .WithMany()
                        .HasForeignKey("GameConsoleConsoleID")
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
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Users", "User")
                        .WithMany("TrackedGames")
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.UserGameProgress", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.Users", "User")
                        .WithMany("UserGameProgress")
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Users", b =>
                {
                    b.Navigation("Sessions");

                    b.Navigation("TrackedGames");

                    b.Navigation("UserGameProgress");
                });
#pragma warning restore 612, 618
        }
    }
}
