using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RetroTrack.Domain.Database.Migrations
{
    /// <inheritdoc />
    public partial class EmulatorTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Emulators",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DefaultExe = table.Column<string>(type: "text", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emulators", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmulatorConsoles",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EmulatorId = table.Column<int>(type: "integer", nullable: false),
                    ConsoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmulatorConsoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmulatorConsoles_Emulators_EmulatorId",
                        column: x => x.EmulatorId,
                        principalTable: "Emulators",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmulatorConsoles_GameConsoles_ConsoleId",
                        column: x => x.ConsoleId,
                        principalTable: "GameConsoles",
                        principalColumn: "ConsoleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmulatorCores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EmulatorId = table.Column<int>(type: "integer", nullable: false),
                    CoreName = table.Column<string>(type: "text", nullable: false),
                    CoreFileName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmulatorCores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmulatorCores_Emulators_EmulatorId",
                        column: x => x.EmulatorId,
                        principalTable: "Emulators",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmulatorCoreConsoles",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EmulatorCoreId = table.Column<int>(type: "integer", nullable: false),
                    ConsoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmulatorCoreConsoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmulatorCoreConsoles_EmulatorCores_EmulatorCoreId",
                        column: x => x.EmulatorCoreId,
                        principalTable: "EmulatorCores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmulatorCoreConsoles_GameConsoles_ConsoleId",
                        column: x => x.ConsoleId,
                        principalTable: "GameConsoles",
                        principalColumn: "ConsoleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmulatorConsoles_ConsoleId",
                table: "EmulatorConsoles",
                column: "ConsoleId");

            migrationBuilder.CreateIndex(
                name: "IX_EmulatorConsoles_EmulatorId",
                table: "EmulatorConsoles",
                column: "EmulatorId");

            migrationBuilder.CreateIndex(
                name: "IX_EmulatorCoreConsoles_ConsoleId",
                table: "EmulatorCoreConsoles",
                column: "ConsoleId");

            migrationBuilder.CreateIndex(
                name: "IX_EmulatorCoreConsoles_EmulatorCoreId",
                table: "EmulatorCoreConsoles",
                column: "EmulatorCoreId");

            migrationBuilder.CreateIndex(
                name: "IX_EmulatorCores_EmulatorId",
                table: "EmulatorCores",
                column: "EmulatorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmulatorConsoles");

            migrationBuilder.DropTable(
                name: "EmulatorCoreConsoles");

            migrationBuilder.DropTable(
                name: "EmulatorCores");

            migrationBuilder.DropTable(
                name: "Emulators");
        }
    }
}
