using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLastUserUpdateColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastUserUpdate",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastUserUpdate",
                table: "Users");
        }
    }
}
