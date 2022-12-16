using Hangfire;
using Hangfire.Dashboard.Dark;
using Hangfire.PostgreSql;
using RetroTrack.Domain;
using Serilog;

Log.Logger = new LoggerConfiguration().WriteTo.Async(x => x.File("Logs/log.log", retainedFileCountLimit: null, rollingInterval: RollingInterval.Day)).WriteTo.Console().CreateLogger();
AppConfig.LoadConfigFromDatabase();

var builder = WebApplication.CreateBuilder(args);

#if RELEASE
builder.WebHost.UseUrls("http://localhost:5003");

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "allowUrls",
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3001", "https://rtapi.bregan.me", "https://retrotrack.bregan.me");
                          policy.WithHeaders("Content-Type");
                          policy.WithMethods("GET", "POST", "DELETE");
                      });
});
#endif

// Add services to the container.
JobStorage.Current = new PostgreSqlStorage(AppConfig.HFConnectionString, new PostgreSqlStorageOptions { SchemaName = "retrotrack" });

builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(AppConfig.HFConnectionString, new PostgreSqlStorageOptions { SchemaName = "retrotrack" })
        .UseDarkDashboard()
        );

builder.Services.AddHangfireServer(options => options.SchedulePollingInterval = TimeSpan.FromSeconds(10));

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

app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();