using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewUserGameProgressTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserGameProgress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false),
                    AchievementsGained = table.Column<int>(type: "integer", nullable: false),
                    AchievementsGainedHardcore = table.Column<int>(type: "integer", nullable: false),
                    HardcoreMode = table.Column<int>(type: "integer", nullable: false),
                    GamePercentage = table.Column<double>(type: "double precision", nullable: false),
                    HighestAwardKind = table.Column<int>(type: "integer", nullable: true),
                    HighestAwardDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGameProgress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGameProgress_Games_Id",
                        column: x => x.Id,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGameProgress_Users_Username",
                        column: x => x.Username,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_Username",
                table: "UserGameProgress",
                column: "Username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserGameProgress");
        }
    }
}
