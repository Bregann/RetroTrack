using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class UpdateCompletedGamesWithNewField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConsoleID",
                table: "CompletedGames",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AchievementsGained",
                table: "CompletedGames",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "CompletedGames",
                type: "TEXT",
                nullable: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConsoleID",
                table: "CompletedGames");

            migrationBuilder.DropColumn(
                name: "AchievementsGained",
                table: "CompletedGames");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "CompletedGames");
        }
    }
}
