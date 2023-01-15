using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUndevvedGamesTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NoAchievementsGameCount",
                table: "GameConsoles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DevWishlist",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevWishlist", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DevWishlist_DevWishlist_GameId",
                        column: x => x.GameId,
                        principalTable: "DevWishlist",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DevWishlist_Users_Username",
                        column: x => x.Username,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UndevvedGames",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    GameConsoleConsoleID = table.Column<int>(type: "integer", nullable: false),
                    Developer = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UndevvedGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UndevvedGames_GameConsoles_GameConsoleConsoleID",
                        column: x => x.GameConsoleConsoleID,
                        principalTable: "GameConsoles",
                        principalColumn: "ConsoleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DevWishlist_GameId",
                table: "DevWishlist",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_DevWishlist_Username",
                table: "DevWishlist",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_UndevvedGames_GameConsoleConsoleID",
                table: "UndevvedGames",
                column: "GameConsoleConsoleID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DevWishlist");

            migrationBuilder.DropTable(
                name: "UndevvedGames");

            migrationBuilder.DropColumn(
                name: "NoAchievementsGameCount",
                table: "GameConsoles");
        }
    }
}
