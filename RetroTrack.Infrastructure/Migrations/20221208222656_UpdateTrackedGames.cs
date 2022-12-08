using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTrackedGames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GameID",
                table: "TrackedGames",
                newName: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedGames_GameId",
                table: "TrackedGames",
                column: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackedGames_Games_GameId",
                table: "TrackedGames",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackedGames_Games_GameId",
                table: "TrackedGames");

            migrationBuilder.DropIndex(
                name: "IX_TrackedGames_GameId",
                table: "TrackedGames");

            migrationBuilder.RenameColumn(
                name: "GameId",
                table: "TrackedGames",
                newName: "GameID");
        }
    }
}
