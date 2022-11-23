using Hangfire.PostgreSql;
using Hangfire;
using RetroTrack.Domain;
using RetroTrack.Domain.Data.External;
using Serilog;
using Hangfire.Dashboard.Dark;

Log.Logger = new LoggerConfiguration().WriteTo.Async(x => x.File("Logs/log.log", retainedFileCountLimit: null, rollingInterval: RollingInterval.Day)).WriteTo.Console().CreateLogger();
AppConfig.LoadConfigFromDatabase();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
JobStorage.Current = new PostgreSqlStorage(AppConfig.HFConnectionString, new PostgreSqlStorageOptions { SchemaName = "retrotrack" });

builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(AppConfig.HFConnectionString, new PostgreSqlStorageOptions { SchemaName = "retrotrack" })
        .UseDarkDashboard()
        );

builder.Services.AddHangfireServer();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

HangfireJobs.SetupHangfireJobs();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
