using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class LoginFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HashedPassword",
                table: "UserData",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HashedPassword",
                table: "UserData");
        }
    }
}
