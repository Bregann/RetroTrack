using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGamesConsoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GameCount",
                table: "GameCounts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameCount",
                table: "GameCounts");
        }
    }
}
