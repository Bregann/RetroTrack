using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroAchievementTracker.Migrations
{
    public partial class UpdateAchievements : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Achievements",
                table: "Achievements");

            migrationBuilder.DropIndex(
                name: "IX_Achievements_Id",
                table: "Achievements");

            migrationBuilder.RenameColumn(
                name: "PointsValue",
                table: "Achievements",
                newName: "ScoreAchievedHardcore");

            migrationBuilder.RenameColumn(
                name: "NumberAwardedHardcore",
                table: "Achievements",
                newName: "PossibleScore");

            migrationBuilder.RenameColumn(
                name: "NumberAwardedCasual",
                table: "Achievements",
                newName: "NumPossibleAchievements");

            migrationBuilder.RenameColumn(
                name: "AchievementTitle",
                table: "Achievements",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "AchievementDescription",
                table: "Achievements",
                newName: "NameAndGameId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Achievements",
                newName: "NumAchievedHardcore");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Games",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AlterColumn<int>(
                name: "NumAchievedHardcore",
                table: "Achievements",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Achievements",
                table: "Achievements",
                column: "NameAndGameId");

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_NameAndGameId",
                table: "Achievements",
                column: "NameAndGameId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Achievements",
                table: "Achievements");

            migrationBuilder.DropIndex(
                name: "IX_Achievements_NameAndGameId",
                table: "Achievements");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Achievements",
                newName: "AchievementTitle");

            migrationBuilder.RenameColumn(
                name: "ScoreAchievedHardcore",
                table: "Achievements",
                newName: "PointsValue");

            migrationBuilder.RenameColumn(
                name: "PossibleScore",
                table: "Achievements",
                newName: "NumberAwardedHardcore");

            migrationBuilder.RenameColumn(
                name: "NumPossibleAchievements",
                table: "Achievements",
                newName: "NumberAwardedCasual");

            migrationBuilder.RenameColumn(
                name: "NumAchievedHardcore",
                table: "Achievements",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "NameAndGameId",
                table: "Achievements",
                newName: "AchievementDescription");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Games",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Achievements",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Achievements",
                table: "Achievements",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_Id",
                table: "Achievements",
                column: "Id",
                unique: true);
        }
    }
}
