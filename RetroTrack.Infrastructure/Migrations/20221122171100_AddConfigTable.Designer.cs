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
    [Migration("20221122171100_AddConfigTable")]
    partial class AddConfigTable
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

                    b.HasKey("ConsoleID");

                    b.ToTable("GameConsoles");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.GameCounts", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("GameConsoleConsoleID")
                        .HasColumnType("integer");

                    b.Property<int>("GameCount")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GameConsoleConsoleID");

                    b.ToTable("GameCounts");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.Games", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<int?>("AchievementCount")
                        .HasColumnType("integer");

                    b.Property<int>("GameConsoleConsoleID")
                        .HasColumnType("integer");

                    b.Property<string>("GameGenre")
                        .HasColumnType("text");

                    b.Property<string>("ImageBoxArt")
                        .HasColumnType("text");

                    b.Property<string>("ImageIcon")
                        .HasColumnType("text");

                    b.Property<string>("ImageIngame")
                        .HasColumnType("text");

                    b.Property<bool>("IsProcessed")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("LastModified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("PlayersCasual")
                        .HasColumnType("integer");

                    b.Property<int?>("PlayersHardcore")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("GameConsoleConsoleID");

                    b.ToTable("Games");
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

                    b.Property<bool>("HardcoreMode")
                        .HasColumnType("boolean");

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

                    b.HasKey("Username");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("RetroTrack.Infrastructure.Database.Models.GameCounts", b =>
                {
                    b.HasOne("RetroTrack.Infrastructure.Database.Models.GameConsoles", "GameConsole")
                        .WithMany()
                        .HasForeignKey("GameConsoleConsoleID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GameConsole");
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
