using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class GamesForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameConsoles_GameConsoleConsoleID",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "GameConsoleConsoleID",
                table: "Games",
                newName: "ConsoleID");

            migrationBuilder.RenameIndex(
                name: "IX_Games_GameConsoleConsoleID",
                table: "Games",
                newName: "IX_Games_ConsoleID");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameConsoles_ConsoleID",
                table: "Games",
                column: "ConsoleID",
                principalTable: "GameConsoles",
                principalColumn: "ConsoleID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameConsoles_ConsoleID",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "ConsoleID",
                table: "Games",
                newName: "GameConsoleConsoleID");

            migrationBuilder.RenameIndex(
                name: "IX_Games_ConsoleID",
                table: "Games",
                newName: "IX_Games_GameConsoleConsoleID");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameConsoles_GameConsoleConsoleID",
                table: "Games",
                column: "GameConsoleConsoleID",
                principalTable: "GameConsoles",
                principalColumn: "ConsoleID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
