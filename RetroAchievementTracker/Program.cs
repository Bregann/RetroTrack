using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using MudBlazor.Services;
using RetroAchievementTracker.Services;
using Serilog;
using RetroAchievementTracker.RetroAchievementsAPI;
using RetroAchievementTracker.Data.NavbarData;
using RetroAchievementTracker.Data.Login;
using Blazored.LocalStorage;
using MudBlazor;
using RetroAchievementTracker.Data.GameData;
using RetroAchievementTracker.Data.GameDataModal;
using RetroAchievementTracker.Data.TableData;

Log.Logger = new LoggerConfiguration().WriteTo.Async(x => x.File("Logs/log.log", retainedFileCountLimit: null, rollingInterval: RollingInterval.Day)).WriteTo.Console().CreateLogger();
Log.Information("Logger Setup");

await JobScheduler.SetupQuartz();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddMudServices( config =>
{
    config.SnackbarConfiguration.PositionClass = Defaults.Classes.Position.BottomLeft;
});

builder.Services.AddSingleton<NavBarService>();
builder.Services.AddSingleton<LoginService>();
builder.Services.AddSingleton<GameDataService>();
builder.Services.AddSingleton<GameDataModalService>();
builder.Services.AddSingleton<TableDataService>();
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

app.Run();
