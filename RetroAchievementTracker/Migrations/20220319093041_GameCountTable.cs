using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class GameCountTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameCounts",
                columns: table => new
                {
                    ConsoleId = table.Column<int>(type: "INTEGER", nullable: false),
                    GameCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameCounts", x => x.ConsoleId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameCounts");
        }
    }
}
