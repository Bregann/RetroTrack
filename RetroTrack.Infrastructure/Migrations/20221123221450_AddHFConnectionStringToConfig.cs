using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetroTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHFConnectionStringToConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageBoxArt",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "ImageIngame",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "PlayersCasual",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "PlayersHardcore",
                table: "Games",
                newName: "Players");

            migrationBuilder.RenameColumn(
                name: "IsProcessed",
                table: "Games",
                newName: "ExtraDataProcessed");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Games",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ImageIcon",
                table: "Games",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AchievementCount",
                table: "Games",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DiscordMessageProcessed",
                table: "Games",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EmailMessageProcessed",
                table: "Games",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "HFConnectionString",
                table: "Config",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Config",
                keyColumn: "Id",
                keyValue: 1,
                column: "HFConnectionString",
                value: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscordMessageProcessed",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "EmailMessageProcessed",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "HFConnectionString",
                table: "Config");

            migrationBuilder.RenameColumn(
                name: "Players",
                table: "Games",
                newName: "PlayersHardcore");

            migrationBuilder.RenameColumn(
                name: "ExtraDataProcessed",
                table: "Games",
                newName: "IsProcessed");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Games",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "ImageIcon",
                table: "Games",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<int>(
                name: "AchievementCount",
                table: "Games",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "ImageBoxArt",
                table: "Games",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageIngame",
                table: "Games",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlayersCasual",
                table: "Games",
                type: "integer",
                nullable: true);
        }
    }
}
