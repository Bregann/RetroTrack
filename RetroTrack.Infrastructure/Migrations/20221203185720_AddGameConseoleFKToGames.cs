using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGameConseoleFKToGames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GameConsoleId",
                table: "Games",
                newName: "GameConsoleConsoleID");

            migrationBuilder.CreateIndex(
                name: "IX_Games_GameConsoleConsoleID",
                table: "Games",
                column: "GameConsoleConsoleID");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameConsoles_GameConsoleConsoleID",
                table: "Games",
                column: "GameConsoleConsoleID",
                principalTable: "GameConsoles",
                principalColumn: "ConsoleID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameConsoles_GameConsoleConsoleID",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_GameConsoleConsoleID",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "GameConsoleConsoleID",
                table: "Games",
                newName: "GameConsoleId");
        }
    }
}
