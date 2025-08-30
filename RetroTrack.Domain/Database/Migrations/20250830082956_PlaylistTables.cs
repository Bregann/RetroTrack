using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RetroTrack.Domain.Database.Migrations
{
    /// <inheritdoc />
    public partial class PlaylistTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserPlaylists",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    PlaylistName = table.Column<string>(type: "text", nullable: false),
                    IsPublic = table.Column<bool>(type: "boolean", nullable: false),
                    UserIdOwner = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPlaylists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPlaylists_Users_UserIdOwner",
                        column: x => x.UserIdOwner,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPlaylistGames",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserPlaylistId = table.Column<string>(type: "text", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPlaylistGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPlaylistGames_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPlaylistGames_UserPlaylists_UserPlaylistId",
                        column: x => x.UserPlaylistId,
                        principalTable: "UserPlaylists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPlaylistLikes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserPlaylistId = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPlaylistLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPlaylistLikes_UserPlaylists_UserPlaylistId",
                        column: x => x.UserPlaylistId,
                        principalTable: "UserPlaylists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPlaylistLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserPlaylistGames_GameId",
                table: "UserPlaylistGames",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPlaylistGames_UserPlaylistId",
                table: "UserPlaylistGames",
                column: "UserPlaylistId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPlaylistLikes_UserId",
                table: "UserPlaylistLikes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPlaylistLikes_UserPlaylistId",
                table: "UserPlaylistLikes",
                column: "UserPlaylistId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPlaylists_UserIdOwner",
                table: "UserPlaylists",
                column: "UserIdOwner");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserPlaylistGames");

            migrationBuilder.DropTable(
                name: "UserPlaylistLikes");

            migrationBuilder.DropTable(
                name: "UserPlaylists");
        }
    }
}
