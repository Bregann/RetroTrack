using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MigratedGameCountsToConsoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameConsoles_GameConsoleConsoleID",
                table: "Games");

            migrationBuilder.DropTable(
                name: "GameCounts");

            migrationBuilder.DropIndex(
                name: "IX_Games_GameConsoleConsoleID",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "GameConsoleConsoleID",
                table: "Games",
                newName: "GameConsoleId");

            migrationBuilder.AddColumn<int>(
                name: "GameCount",
                table: "GameConsoles",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameCount",
                table: "GameConsoles");

            migrationBuilder.RenameColumn(
                name: "GameConsoleId",
                table: "Games",
                newName: "GameConsoleConsoleID");

            migrationBuilder.CreateTable(
                name: "GameCounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GameConsoleConsoleID = table.Column<int>(type: "integer", nullable: false),
                    GameCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameCounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameCounts_GameConsoles_GameConsoleConsoleID",
                        column: x => x.GameConsoleConsoleID,
                        principalTable: "GameConsoles",
                        principalColumn: "ConsoleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_GameConsoleConsoleID",
                table: "Games",
                column: "GameConsoleConsoleID");

            migrationBuilder.CreateIndex(
                name: "IX_GameCounts_GameConsoleConsoleID",
                table: "GameCounts",
                column: "GameConsoleConsoleID");

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
