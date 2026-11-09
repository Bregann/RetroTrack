using RetroTrack.Domain.Enums;
using RetroTrack.Domain.Interfaces.Helpers;
using Serilog;
using System.Net.Http.Json;

namespace RetroTrack.Domain.Services.Helpers
{
    /// <summary>
    /// Reports to Project Monitor (POST /api/report) so its Heartbeat check knows this project is running.
    /// Does nothing until the ProjectMonitorApiKey environmental setting is added.
    /// </summary>
    public class ProjectMonitorClient(HttpClient httpClient, IEnvironmentalSettingHelper environmentalSettingHelper) : IProjectMonitorClient
    {
        // Project Monitor is reached over the internal Docker network, like CommsSender
        private const string ReportUrl = "http://ProjectMonitor:8080/api/report";

        private static bool _missingKeyLogged;

        public async Task SendHeartbeat()
        {
            string? apiKey = environmentalSettingHelper.TryGetEnviromentalSettingValue(EnvironmentalSettingEnum.ProjectMonitorApiKey);

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                if (!_missingKeyLogged)
                {
                    Log.Information("[ProjectMonitor] No ProjectMonitorApiKey setting, so heartbeats are off");
                    _missingKeyLogged = true;
                }

                return;
            }

            try
            {
                using HttpRequestMessage request = new(HttpMethod.Post, ReportUrl)
                {
                    Content = JsonContent.Create(new { values = new Dictionary<string, object>() })
                };
                request.Headers.Add("X-ProjectMonitor-ApiKey", apiKey);

                using HttpResponseMessage response = await httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    Log.Warning("[ProjectMonitor] Heartbeat rejected with {StatusCode}", (int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Log.Warning("[ProjectMonitor] Couldn't send heartbeat: {Message}", ex.Message);
            }
        }
    }
}
