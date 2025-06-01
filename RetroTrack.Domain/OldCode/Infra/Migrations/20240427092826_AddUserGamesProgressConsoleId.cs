using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserGamesProgressConsoleId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConsoleId",
                table: "UserGameProgress",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_ConsoleId",
                table: "UserGameProgress",
                column: "ConsoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserGameProgress_GameConsoles_ConsoleId",
                table: "UserGameProgress",
                column: "ConsoleId",
                principalTable: "GameConsoles",
                principalColumn: "ConsoleID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserGameProgress_GameConsoles_ConsoleId",
                table: "UserGameProgress");

            migrationBuilder.DropIndex(
                name: "IX_UserGameProgress_ConsoleId",
                table: "UserGameProgress");

            migrationBuilder.DropColumn(
                name: "ConsoleId",
                table: "UserGameProgress");
        }
    }
}
