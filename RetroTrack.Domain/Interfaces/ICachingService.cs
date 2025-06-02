namespace RetroTrack.Domain.Interfaces
{
    public interface ICachingService
    {
        void AddOrUpdateCacheItem(string cacheName, string jsonData, int minutesToCacheFor = 10);
        string? GetCacheItem(string cacheName);
    }
}
