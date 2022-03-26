using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class AddUsernameFieldToTrackedGames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "TrackedGames",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "TrackedGames");
        }
    }
}
