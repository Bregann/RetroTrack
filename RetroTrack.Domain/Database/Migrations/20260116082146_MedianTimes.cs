using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Domain.Database.Migrations
{
    /// <inheritdoc />
    public partial class MedianTimes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "MedianTimeToBeat",
                table: "Games",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "MedianTimeToBeatHardcore",
                table: "Games",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "MedianTimeToComplete",
                table: "Games",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "MedianTimeToMaster",
                table: "Games",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MedianTimesProcessed",
                table: "Games",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedianTimeToBeat",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "MedianTimeToBeatHardcore",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "MedianTimeToComplete",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "MedianTimeToMaster",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "MedianTimesProcessed",
                table: "Games");
        }
    }
}
