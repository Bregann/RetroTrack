namespace RetroTrack.Domain.Interfaces.Helpers
{
    public interface IProjectMonitorClient
    {
        /// <summary>Tells Project Monitor this project is running. Never throws: failures are only logged.</summary>
        Task SendHeartbeat();
    }
}
