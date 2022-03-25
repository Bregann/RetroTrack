using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class RemovedAchievementTableAndRenamedCompletedGames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Achievements");

            migrationBuilder.DropTable(
                name: "CompletedGames");

            migrationBuilder.CreateTable(
                name: "UserGameProgress",
                columns: table => new
                {
                    UsernameGameID = table.Column<string>(type: "TEXT", nullable: false),
                    GameID = table.Column<int>(type: "INTEGER", nullable: false),
                    ConsoleID = table.Column<int>(type: "INTEGER", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    AchievementsGained = table.Column<int>(type: "INTEGER", nullable: false),
                    GameName = table.Column<string>(type: "TEXT", nullable: false),
                    HardcoreMode = table.Column<int>(type: "INTEGER", nullable: false),
                    GamePercentage = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGameProgress", x => x.UsernameGameID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserGameProgress");

            migrationBuilder.CreateTable(
                name: "Achievements",
                columns: table => new
                {
                    NameAndGameId = table.Column<string>(type: "TEXT", nullable: false),
                    GameId = table.Column<int>(type: "INTEGER", nullable: false),
                    NumAchievedHardcore = table.Column<int>(type: "INTEGER", nullable: false),
                    NumPossibleAchievements = table.Column<int>(type: "INTEGER", nullable: false),
                    PossibleScore = table.Column<int>(type: "INTEGER", nullable: false),
                    ScoreAchievedHardcore = table.Column<int>(type: "INTEGER", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Achievements", x => x.NameAndGameId);
                });

            migrationBuilder.CreateTable(
                name: "CompletedGames",
                columns: table => new
                {
                    UsernameGameID = table.Column<string>(type: "TEXT", nullable: false),
                    AchievementsGained = table.Column<int>(type: "INTEGER", nullable: false),
                    ConsoleID = table.Column<int>(type: "INTEGER", nullable: false),
                    GameID = table.Column<int>(type: "INTEGER", nullable: false),
                    GameName = table.Column<string>(type: "TEXT", nullable: false),
                    HardcoreMode = table.Column<int>(type: "INTEGER", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompletedGames", x => x.UsernameGameID);
                });
        }
    }
}
