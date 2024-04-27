using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserGameProgressFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserGameProgress_Games_Id",
                table: "UserGameProgress");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "UserGameProgress",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

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

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "UserGameProgress",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddForeignKey(
                name: "FK_UserGameProgress_Games_Id",
                table: "UserGameProgress",
                column: "Id",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
