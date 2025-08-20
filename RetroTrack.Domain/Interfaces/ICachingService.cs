namespace RetroTrack.Domain.Interfaces
{
    public interface ICachingService
    {
        Task AddOrUpdateCacheItem(string cacheName, string jsonData, int minutesToCacheFor = 10);
        Task<string?> GetCacheItem(string cacheName);
    }
}