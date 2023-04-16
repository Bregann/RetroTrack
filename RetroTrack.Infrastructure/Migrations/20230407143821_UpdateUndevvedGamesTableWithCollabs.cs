using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUndevvedGamesTableWithCollabs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Developer",
                table: "UndevvedGames",
                newName: "PrimaryDeveloper");

            migrationBuilder.AddColumn<List<string>>(
                name: "CollabDevelopers",
                table: "UndevvedGames",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CollabDevelopers",
                table: "UndevvedGames");

            migrationBuilder.RenameColumn(
                name: "PrimaryDeveloper",
                table: "UndevvedGames",
                newName: "Developer");
        }
    }
}
