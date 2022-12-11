using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserProgressTableWithIndexs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConsoleID",
                table: "UserGameProgress");

            migrationBuilder.DropColumn(
                name: "GameName",
                table: "UserGameProgress");

            migrationBuilder.RenameColumn(
                name: "GameID",
                table: "UserGameProgress",
                newName: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_GameId",
                table: "UserGameProgress",
                column: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserGameProgress_Games_GameId",
                table: "UserGameProgress",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserGameProgress_Games_GameId",
                table: "UserGameProgress");

            migrationBuilder.DropIndex(
                name: "IX_UserGameProgress_GameId",
                table: "UserGameProgress");

            migrationBuilder.RenameColumn(
                name: "GameId",
                table: "UserGameProgress",
                newName: "GameID");

            migrationBuilder.AddColumn<int>(
                name: "ConsoleID",
                table: "UserGameProgress",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GameName",
                table: "UserGameProgress",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
