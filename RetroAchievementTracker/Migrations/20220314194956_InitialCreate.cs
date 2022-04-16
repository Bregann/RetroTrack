using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Achievements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    GameId = table.Column<int>(type: "INTEGER", nullable: false),
                    NumberAwardedCasual = table.Column<int>(type: "INTEGER", nullable: false),
                    NumberAwardedHardcore = table.Column<int>(type: "INTEGER", nullable: false),
                    AchievementTitle = table.Column<string>(type: "TEXT", nullable: false),
                    AchievementDescription = table.Column<string>(type: "TEXT", nullable: false),
                    PointsValue = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Achievements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CompletedGames",
                columns: table => new
                {
                    UsernameGameID = table.Column<string>(type: "TEXT", nullable: false),
                    GameID = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageIcon = table.Column<string>(type: "TEXT", nullable: false),
                    GameName = table.Column<string>(type: "TEXT", nullable: false),
                    HardcoreMode = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompletedGames", x => x.UsernameGameID);
                });

            migrationBuilder.CreateTable(
                name: "GameConsoles",
                columns: table => new
                {
                    ConsoleID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ConsoleName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameConsoles", x => x.ConsoleID);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    ConsoleID = table.Column<int>(type: "INTEGER", nullable: false),
                    imageIcon = table.Column<string>(type: "TEXT", nullable: false),
                    DateAdded = table.Column<DateTime>(type: "TEXT", nullable: false),
                    GameGenre = table.Column<string>(type: "TEXT", nullable: false),
                    ReleaseDate = table.Column<int>(type: "INTEGER", nullable: false),
                    AchievementCount = table.Column<int>(type: "INTEGER", nullable: false),
                    PlayersCasual = table.Column<int>(type: "INTEGER", nullable: false),
                    PlayersHardcore = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserData",
                columns: table => new
                {
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    HashedApiKey = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserData", x => x.Username);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_Id",
                table: "Achievements",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompletedGames_UsernameGameID",
                table: "CompletedGames",
                column: "UsernameGameID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameConsoles_ConsoleID",
                table: "GameConsoles",
                column: "ConsoleID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_Id",
                table: "Games",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserData_Username",
                table: "UserData",
                column: "Username",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Achievements");

            migrationBuilder.DropTable(
                name: "CompletedGames");

            migrationBuilder.DropTable(
                name: "GameConsoles");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "UserData");
        }
    }
}
