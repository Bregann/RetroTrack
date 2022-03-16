using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class UpdateGames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserData_Username",
                table: "UserData");

            migrationBuilder.DropIndex(
                name: "IX_Games_Id",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_GameConsoles_ConsoleID",
                table: "GameConsoles");

            migrationBuilder.DropIndex(
                name: "IX_CompletedGames_UsernameGameID",
                table: "CompletedGames");

            migrationBuilder.DropIndex(
                name: "IX_Achievements_NameAndGameId",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "ReleaseDate",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "imageIcon",
                table: "Games",
                newName: "ImageIcon");

            migrationBuilder.AlterColumn<string>(
                name: "ImageIcon",
                table: "Games",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "ImageBoxArt",
                table: "Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageIngame",
                table: "Games",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageBoxArt",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "ImageIngame",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "ImageIcon",
                table: "Games",
                newName: "imageIcon");

            migrationBuilder.AlterColumn<string>(
                name: "imageIcon",
                table: "Games",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReleaseDate",
                table: "Games",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserData_Username",
                table: "UserData",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_Id",
                table: "Games",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameConsoles_ConsoleID",
                table: "GameConsoles",
                column: "ConsoleID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompletedGames_UsernameGameID",
                table: "CompletedGames",
                column: "UsernameGameID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_NameAndGameId",
                table: "Achievements",
                column: "NameAndGameId",
                unique: true);
        }
    }
}
