using Blazored.LocalStorage;
using MudBlazor;
using MudBlazor.Services;
using ProjectMonitor.Shared;
using RetroAchievementTracker;
using RetroAchievementTracker.Data.GameData;
using RetroAchievementTracker.Data.HistoricGameData;
using RetroAchievementTracker.Data.Login;
using RetroAchievementTracker.Data.NavbarData;
using RetroAchievementTracker.Data.TableData;
using RetroAchievementTracker.Data.TrackedGames;
using RetroAchievementTracker.RetroAchievementsAPI;
using RetroAchievementTracker.Services;
using Serilog;

Log.Logger = new LoggerConfiguration().WriteTo.Async(x => x.File("Logs/log.log", retainedFileCountLimit: null, rollingInterval: RollingInterval.Day)).WriteTo.Console().CreateLogger();
Log.Information("Logger Setup");

//Setup project monitor
#if DEBUG
ProjectMonitorConfig.SetupMonitor("debug", "");
#else
ProjectMonitorConfig.SetupMonitor("release", "");
#endif

ProjectMonitorCommon.ReportProjectUp("retroachievements");

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

await JobScheduler.SetupQuartz();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddMudServices(config =>
{
    config.SnackbarConfiguration.PositionClass = Defaults.Classes.Position.BottomLeft;
});

builder.Services.AddSingleton<NavBarService>();
builder.Services.AddSingleton<LoginService>();
builder.Services.AddSingleton<HistoricGameDataService>();
builder.Services.AddSingleton<GameDataService>();
builder.Services.AddSingleton<TableDataService>();
builder.Services.AddSingleton<RetroAchievements>();
builder.Services.AddSingleton<TrackedGamesService>();
builder.Services.AddBlazoredLocalStorage();
builder.Services.AddResponseCompression();
builder.Logging.AddSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    builder.WebHost.UseUrls("http://localhost:5001");
}

app.UseResponseCompression();

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/sitemap.xml", () => File.ReadAllText("sitemap.xml"));
});

app.Run();
