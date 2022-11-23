using RetroTrack.Domain;
using RetroTrack.Domain.Data.External;
using Serilog;

Log.Logger = new LoggerConfiguration().WriteTo.Async(x => x.File("Logs/log.log", retainedFileCountLimit: null, rollingInterval: RollingInterval.Day)).WriteTo.Console().CreateLogger();
AppConfig.LoadConfigFromDatabase();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

await RetroAchievements.GetConsolesAndInsertToDatabase();

app.Run();
