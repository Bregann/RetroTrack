using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class postgresInit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameConsoles",
                columns: table => new
                {
                    ConsoleID = table.Column<int>(type: "integer", nullable: false),
                    ConsoleName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameConsoles", x => x.ConsoleID);
                });

            migrationBuilder.CreateTable(
                name: "GameCounts",
                columns: table => new
                {
                    ConsoleId = table.Column<int>(type: "integer", nullable: false),
                    GameCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameCounts", x => x.ConsoleId);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ConsoleID = table.Column<int>(type: "integer", nullable: false),
                    ConsoleName = table.Column<string>(type: "text", nullable: false),
                    ImageIcon = table.Column<string>(type: "text", nullable: true),
                    ImageIngame = table.Column<string>(type: "text", nullable: true),
                    ImageBoxArt = table.Column<string>(type: "text", nullable: true),
                    DateAdded = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    GameGenre = table.Column<string>(type: "text", nullable: true),
                    AchievementCount = table.Column<int>(type: "integer", nullable: true),
                    PlayersCasual = table.Column<int>(type: "integer", nullable: true),
                    PlayersHardcore = table.Column<int>(type: "integer", nullable: true),
                    IsProcessed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrackedGames",
                columns: table => new
                {
                    UsernameGameID = table.Column<string>(type: "text", nullable: false),
                    GameID = table.Column<int>(type: "integer", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackedGames", x => x.UsernameGameID);
                });

            migrationBuilder.CreateTable(
                name: "UserData",
                columns: table => new
                {
                    Username = table.Column<string>(type: "text", nullable: false),
                    HashedApiKey = table.Column<string>(type: "text", nullable: false),
                    HashedPassword = table.Column<string>(type: "text", nullable: false),
                    LoginToken = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserData", x => x.Username);
                });

            migrationBuilder.CreateTable(
                name: "UserGameProgress",
                columns: table => new
                {
                    UsernameGameID = table.Column<string>(type: "text", nullable: false),
                    GameID = table.Column<int>(type: "integer", nullable: false),
                    ConsoleID = table.Column<int>(type: "integer", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    AchievementsGained = table.Column<int>(type: "integer", nullable: false),
                    GameName = table.Column<string>(type: "text", nullable: false),
                    HardcoreMode = table.Column<int>(type: "integer", nullable: false),
                    GamePercentage = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGameProgress", x => x.UsernameGameID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameConsoles");

            migrationBuilder.DropTable(
                name: "GameCounts");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "TrackedGames");

            migrationBuilder.DropTable(
                name: "UserData");

            migrationBuilder.DropTable(
                name: "UserGameProgress");
        }
    }
}
