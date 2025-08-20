using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.Interfaces;
using Serilog;

namespace RetroTrack.Domain.Services
{
    public class CachingService(AppDbContext context) : ICachingService
    {
        public async Task AddOrUpdateCacheItem(string cacheName, string jsonData, int minutesToCacheFor = 10)
        {
            var cachedItem = await context.DataCaching.FirstOrDefaultAsync(x => x.CacheName == cacheName);

            if (cachedItem == null)
            {
                await context.AddAsync(new DataCaching
                {
                    CacheName = cacheName,
                    CacheData = jsonData,
                    LastUpdate = DateTime.UtcNow,
                    MinutesToCacheFor = minutesToCacheFor
                });

                await context.SaveChangesAsync();
                Log.Information($"[Data Caching] Data caching added for {cacheName}. This expires in {minutesToCacheFor} minutes");
                return;
            }

            cachedItem.LastUpdate = DateTime.UtcNow;
            cachedItem.CacheData = jsonData;
            cachedItem.MinutesToCacheFor = minutesToCacheFor;
            await context.SaveChangesAsync();

            Log.Information($"[Data Caching] Data caching updated for {cacheName}. This expires in {minutesToCacheFor} minutes");
        }

        public async Task<string?> GetCacheItem(string cacheName)
        {
            var cachedItem = await context.DataCaching.FirstOrDefaultAsync(x => x.CacheName == cacheName);

            if (cachedItem == null)
            {
                return null;
            }

            var cacheMinutes = DateTime.UtcNow - cachedItem.LastUpdate;

            //Check if the cache time has passed, if so then return null as it will need to be updated
            if (cacheMinutes.TotalMinutes > cachedItem.MinutesToCacheFor)
            {
                // delete the cache item as it has expired
                context.DataCaching.Remove(cachedItem);
                await context.SaveChangesAsync();
                return null;
            }

            Log.Information($"[Data Caching] {cacheName} pulled from the cache");
            return cachedItem.CacheData;
        }
    }
}