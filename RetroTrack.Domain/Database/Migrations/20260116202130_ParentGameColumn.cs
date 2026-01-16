using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Domain.Database.Migrations
{
    /// <inheritdoc />
    public partial class ParentGameColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentGameId",
                table: "Games",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParentGameId",
                table: "Games");
        }
    }
}
