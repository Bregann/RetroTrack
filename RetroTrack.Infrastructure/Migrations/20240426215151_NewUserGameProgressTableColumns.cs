using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewUserGameProgressTableColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HardcoreMode",
                table: "UserGameProgress");

            migrationBuilder.AddColumn<double>(
                name: "GamePercentageHardcore",
                table: "UserGameProgress",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GamePercentageHardcore",
                table: "UserGameProgress");

            migrationBuilder.AddColumn<int>(
                name: "HardcoreMode",
                table: "UserGameProgress",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
