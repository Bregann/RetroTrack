using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RetroTrack.Domain.Database.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DataCaching",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CacheName = table.Column<string>(type: "text", nullable: false),
                    CacheData = table.Column<string>(type: "text", nullable: false),
                    MinutesToCacheFor = table.Column<int>(type: "integer", nullable: false),
                    LastUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataCaching", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EnvironmentalSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnvironmentalSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GameConsoles",
                columns: table => new
                {
                    ConsoleId = table.Column<int>(type: "integer", nullable: false),
                    ConsoleName = table.Column<string>(type: "text", nullable: false),
                    GameCount = table.Column<int>(type: "integer", nullable: false),
                    NoAchievementsGameCount = table.Column<int>(type: "integer", nullable: false),
                    ConsoleType = table.Column<int>(type: "integer", nullable: false),
                    DisplayOnSite = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameConsoles", x => x.ConsoleId);
                });

            migrationBuilder.CreateTable(
                name: "RetroAchievementsLogAndLoadData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    JsonData = table.Column<string>(type: "text", nullable: false),
                    ProcessingStatus = table.Column<int>(type: "integer", nullable: false),
                    FailedProcessingAttempts = table.Column<int>(type: "integer", nullable: false),
                    JobType = table.Column<int>(type: "integer", nullable: false),
                    LastUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RetroAchievementsLogAndLoadData", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LoginUsername = table.Column<string>(type: "text", nullable: false),
                    RAUsername = table.Column<string>(type: "text", nullable: false),
                    RAUserUlid = table.Column<string>(type: "text", nullable: false),
                    OldHashedPassword = table.Column<string>(type: "text", nullable: false),
                    HashedPassword = table.Column<string>(type: "text", nullable: false),
                    HashedPasswordMigrated = table.Column<bool>(type: "boolean", nullable: false),
                    LastActivity = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastUserUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastAchievementsUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserProfileUrl = table.Column<string>(type: "text", nullable: false),
                    UserPoints = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ConsoleId = table.Column<int>(type: "integer", nullable: false),
                    ImageIcon = table.Column<string>(type: "text", nullable: false),
                    Points = table.Column<int>(type: "integer", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastExtraDataProcessedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SetReleasedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastAchievementCountChangeDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AchievementCount = table.Column<int>(type: "integer", nullable: false),
                    GameGenre = table.Column<string>(type: "text", nullable: true),
                    Players = table.Column<int>(type: "integer", nullable: true),
                    HasAchievements = table.Column<bool>(type: "boolean", nullable: false),
                    ExtraDataProcessed = table.Column<bool>(type: "boolean", nullable: false),
                    DiscordMessageProcessed = table.Column<bool>(type: "boolean", nullable: false),
                    EmailMessageProcessed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Games_GameConsoles_ConsoleId",
                        column: x => x.ConsoleId,
                        principalTable: "GameConsoles",
                        principalColumn: "ConsoleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RetroAchievementsLogAndLoadErrors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LogAndLoadDataId = table.Column<int>(type: "integer", nullable: false),
                    ErrorMessage = table.Column<string>(type: "text", nullable: false),
                    ErrorTimestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RetroAchievementsLogAndLoadErrors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RetroAchievementsLogAndLoadErrors_RetroAchievementsLogAndLo~",
                        column: x => x.LogAndLoadDataId,
                        principalTable: "RetroAchievementsLogAndLoadData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sessions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    SessionId = table.Column<string>(type: "text", nullable: false),
                    ExpiryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sessions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Achievements",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AchievementName = table.Column<string>(type: "text", nullable: false),
                    AchievementDescription = table.Column<string>(type: "text", nullable: false),
                    AchievementIcon = table.Column<string>(type: "text", nullable: false),
                    Points = table.Column<int>(type: "integer", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    AchievementType = table.Column<int>(type: "integer", nullable: true),
                    NumAwarded = table.Column<long>(type: "bigint", nullable: false),
                    NumAwardedHardcore = table.Column<long>(type: "bigint", nullable: false),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Author = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Achievements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Achievements_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrackedGames",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GameId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackedGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackedGames_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackedGames_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGameProgress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false),
                    ConsoleId = table.Column<int>(type: "integer", nullable: false),
                    AchievementsGained = table.Column<int>(type: "integer", nullable: false),
                    AchievementsGainedHardcore = table.Column<int>(type: "integer", nullable: false),
                    GamePercentage = table.Column<double>(type: "double precision", nullable: false),
                    GamePercentageHardcore = table.Column<double>(type: "double precision", nullable: false),
                    MostRecentAwardedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    HighestAwardKind = table.Column<int>(type: "integer", nullable: true),
                    HighestAwardDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGameProgress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGameProgress_GameConsoles_ConsoleId",
                        column: x => x.ConsoleId,
                        principalTable: "GameConsoles",
                        principalColumn: "ConsoleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGameProgress_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGameProgress_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_GameId",
                table: "Achievements",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Games_ConsoleId",
                table: "Games",
                column: "ConsoleId");

            migrationBuilder.CreateIndex(
                name: "IX_RetroAchievementsLogAndLoadErrors_LogAndLoadDataId",
                table: "RetroAchievementsLogAndLoadErrors",
                column: "LogAndLoadDataId");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_UserId",
                table: "Sessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedGames_GameId",
                table: "TrackedGames",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedGames_UserId",
                table: "TrackedGames",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_ConsoleId",
                table: "UserGameProgress",
                column: "ConsoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_GameId",
                table: "UserGameProgress",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameProgress_UserId",
                table: "UserGameProgress",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Achievements");

            migrationBuilder.DropTable(
                name: "DataCaching");

            migrationBuilder.DropTable(
                name: "EnvironmentalSettings");

            migrationBuilder.DropTable(
                name: "RetroAchievementsLogAndLoadErrors");

            migrationBuilder.DropTable(
                name: "Sessions");

            migrationBuilder.DropTable(
                name: "TrackedGames");

            migrationBuilder.DropTable(
                name: "UserGameProgress");

            migrationBuilder.DropTable(
                name: "RetroAchievementsLogAndLoadData");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "GameConsoles");
        }
    }
}
