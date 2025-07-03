using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Domain.Database.Migrations
{
    /// <inheritdoc />
    public partial class UserPointsColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserPoints",
                table: "Users",
                newName: "UserPointsSoftcore");

            migrationBuilder.AddColumn<long>(
                name: "UserPointsHardcore",
                table: "Users",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserPointsHardcore",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "UserPointsSoftcore",
                table: "Users",
                newName: "UserPoints");
        }
    }
}
