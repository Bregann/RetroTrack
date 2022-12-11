using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Database : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RetroAchievementsApiUsername = table.Column<string>(type: "text", nullable: false),
                    RetroAchievementsApiKey = table.Column<string>(type: "text", nullable: false),
                    HFConnectionString = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Config", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DataCaching",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CacheName = table.Column<string>(type: "text", nullable: false),
                    CacheData = table.Column<string>(type: "text", nullable: false),
                    MinutesToCacheFor = table.Column<int>(type: "integer", nullable: false),
                    LastUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataCaching", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GameConsoles",
                columns: table => new
                {
                    ConsoleID = table.Column<int>(type: "integer", nullable: false),
                    ConsoleName = table.Column<string>(type: "text", nullable: false),
                    GameCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameConsoles", x => x.ConsoleID);
                });

            migrationBuilder.CreateTable(
                name: "RetroAchievementsApiData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    JsonData = table.Column<string>(type: "text", nullable: false),
                    ProcessingStatus = table.Column<int>(type: "integer", nullable: false),
                    FailedProcessingAttempts = table.Column<int>(type: "integer", nullable: false),
                    ApiRequestType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RetroAchievementsApiData", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Username = table.Column<string>(type: "text", nullable: false),
                    HashedPassword = table.Column<string>(type: "text", nullable: false),
                    LastActivity = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastUserUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastAchievementsUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserProfileUrl = table.Column<string>(type: "text", nullable: false),
                    UserPoints = table.Column<long>(type: "bigint", nullable: false),
                    UserRank = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Username);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    GameConsoleConsoleID = table.Column<int>(type: "integer", nullable: false),
                    ImageIcon = table.Column<string>(type: "text", nullable: false),
                    Points = table.Column<int>(type: "integer", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AchievementCount = table.Column<int>(type: "integer", nullable: false),
                    GameGenre = table.Column<string>(type: "text", nullable: true),
                    Players = table.Column<int>(type: "integer", nullable: true),
                    ExtraDataProcessed = table.Column<bool>(type: "boolean", nullable: false),
                    DiscordMessageProcessed = table.Column<bool>(type: "boolean", nullable: false),
                    EmailMessageProcessed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Games_GameConsoles_GameConsoleConsoleID",
                        column: x => x.GameConsoleConsoleID,
                        principalTable: "GameConsoles",
                        principalColumn: "ConsoleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sessions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    SessionId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sessions_Users_Username",
                        column: x => x.Username,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrackedGames",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GameId = table.Column<int>(type: "integer", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackedGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackedGames_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackedGames_Users_Username",
                        column: x => x.Username,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGameProgress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false),
                    AchievementsGained = table.Column<int>(type: "integer", nullable: false),
                    HardcoreMode = table.Column<int>(type: "integer", nullable: false),
                    GamePercentage = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGameProgress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGameProgress_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGameProgress_Users_Username",
                        column: x => x.Username,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Config",
                columns: new[] { "Id", "HFConnectionString", "RetroAchievementsApiKey", "RetroAchievementsApiUsername" },
                values: new object[] { 1, "", "", "" });

            migrationBuilder.CreateIndex(
                name: "IX_Games_GameConsoleConsoleID",
                table: "Games",
                column: "GameConsoleConsoleID");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_Username",
                table: "Sessions",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedGames_GameId",
                table: "TrackedGames",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedGames_Username",
                table: "TrackedGames",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_GameId",
                table: "UserGameProgress",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_Username",
                table: "UserGameProgress",
                column: "Username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Config");

            migrationBuilder.DropTable(
                name: "DataCaching");

            migrationBuilder.DropTable(
                name: "RetroAchievementsApiData");

            migrationBuilder.DropTable(
                name: "Sessions");

            migrationBuilder.DropTable(
                name: "TrackedGames");

            migrationBuilder.DropTable(
                name: "UserGameProgress");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "GameConsoles");
        }
    }
}
