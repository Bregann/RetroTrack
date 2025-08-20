using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Domain.Database.Migrations
{
    /// <inheritdoc />
    public partial class UgpWallPosition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WallPosition",
                table: "UserGameProgress",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WallPosition",
                table: "UserGameProgress");
        }
    }
}