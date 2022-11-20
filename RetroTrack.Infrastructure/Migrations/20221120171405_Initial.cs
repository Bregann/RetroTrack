using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
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
                name: "Users",
                columns: table => new
                {
                    Username = table.Column<string>(type: "text", nullable: false),
                    HashedPassword = table.Column<string>(type: "text", nullable: false),
                    LastActivity = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Username);
                });

            migrationBuilder.CreateTable(
                name: "GameCounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GameConsoleConsoleID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameCounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameCounts_GameConsoles_GameConsoleConsoleID",
                        column: x => x.GameConsoleConsoleID,
                        principalTable: "GameConsoles",
                        principalColumn: "ConsoleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    GameConsoleConsoleID = table.Column<int>(type: "integer", nullable: false),
                    ImageIcon = table.Column<string>(type: "text", nullable: true),
                    ImageIngame = table.Column<string>(type: "text", nullable: true),
                    ImageBoxArt = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    GameGenre = table.Column<string>(type: "text", nullable: true),
                    AchievementCount = table.Column<int>(type: "integer", nullable: true),
                    PlayersCasual = table.Column<int>(type: "integer", nullable: true),
                    PlayersHardcore = table.Column<int>(type: "integer", nullable: true),
                    IsProcessed = table.Column<bool>(type: "boolean", nullable: false)
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
                    Id = table.Column<string>(type: "text", nullable: false),
                    GameID = table.Column<int>(type: "integer", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackedGames", x => x.Id);
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
                    GameID = table.Column<int>(type: "integer", nullable: false),
                    ConsoleID = table.Column<int>(type: "integer", nullable: false),
                    AchievementsGained = table.Column<int>(type: "integer", nullable: false),
                    GameName = table.Column<string>(type: "text", nullable: false),
                    HardcoreMode = table.Column<bool>(type: "boolean", nullable: false),
                    GamePercentage = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGameProgress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGameProgress_Users_Username",
                        column: x => x.Username,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameCounts_GameConsoleConsoleID",
                table: "GameCounts",
                column: "GameConsoleConsoleID");

            migrationBuilder.CreateIndex(
                name: "IX_Games_GameConsoleConsoleID",
                table: "Games",
                column: "GameConsoleConsoleID");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_Username",
                table: "Sessions",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedGames_Username",
                table: "TrackedGames",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_Username",
                table: "UserGameProgress",
                column: "Username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameCounts");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Sessions");

            migrationBuilder.DropTable(
                name: "TrackedGames");

            migrationBuilder.DropTable(
                name: "UserGameProgress");

            migrationBuilder.DropTable(
                name: "GameConsoles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
