using BreganUtils.ProjectMonitor;
using Hangfire;
using Hangfire.Dashboard.BasicAuthorization;
using Hangfire.Dashboard.Dark;
using Hangfire.PostgreSql;
using RetroTrack.Domain;
using Serilog;

Log.Logger = new LoggerConfiguration().WriteTo.Async(x => x.File("Logs/log.log", retainedFileCountLimit: 3, rollingInterval: RollingInterval.Day)).WriteTo.Console().CreateLogger();

await Task.Delay(2000);

AppConfig.LoadConfigFromDatabase();

//Setup project monitor
#if DEBUG
ProjectMonitorConfig.SetupMonitor("debug", AppConfig.ProjectMonitorApiKey);
#else
ProjectMonitorConfig.SetupMonitor("release", AppConfig.ProjectMonitorApiKey);
#endif

var builder = WebApplication.CreateBuilder(args);

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

// Add services to the container.
GlobalConfiguration.Configuration.UsePostgreSqlStorage(c => c.UseNpgsqlConnection(Environment.GetEnvironmentVariable("RetroTrackConnString")));

builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(c => c.UseNpgsqlConnection(Environment.GetEnvironmentVariable("RetroTrackConnString")))
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

var auth = new[] { new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions
{
    RequireSsl = false,
    SslRedirect = false,
    LoginCaseSensitive = true,
    Users = new []
    {
        new BasicAuthAuthorizationUser
        {
            Login = AppConfig.HFUsername,
            PasswordClear = AppConfig.HFPassword
        }
    }
})};

app.MapHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = auth
}, JobStorage.Current);

app.Run();