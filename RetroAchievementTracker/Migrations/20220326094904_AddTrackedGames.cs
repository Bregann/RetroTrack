using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class AddTrackedGames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TrackedGames",
                columns: table => new
                {
                    UsernameGameID = table.Column<string>(type: "TEXT", nullable: false),
                    GameID = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackedGames", x => x.UsernameGameID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrackedGames");
        }
    }
}
