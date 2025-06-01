using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.Interfaces;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Services
{
    public class CachingService(AppDbContext context) : ICachingService
    {
        public void AddOrUpdateCacheItem(string cacheName, string jsonData, int minutesToCacheFor = 10)
        {
            var cachedItem = context.DataCaching.FirstOrDefault(x => x.CacheName == cacheName);

            if (cachedItem == null)
            {
                context.Add(new DataCaching
                {
                    CacheName = cacheName,
                    CacheData = jsonData,
                    LastUpdate = DateTime.UtcNow,
                    MinutesToCacheFor = minutesToCacheFor
                });

                context.SaveChanges();
                Log.Information($"[Data Caching] Data caching added for {cacheName}. This expires in {minutesToCacheFor} minutes");
                return;
            }

            cachedItem.LastUpdate = DateTime.UtcNow;
            cachedItem.CacheData = jsonData;
            cachedItem.MinutesToCacheFor = minutesToCacheFor;
            context.SaveChanges();

            Log.Information($"[Data Caching] Data caching updated for {cacheName}. This expires in {minutesToCacheFor} minutes");
        }

        public string? GetCacheItem(string cacheName)
        {
            var cachedItem = context.DataCaching.FirstOrDefault(x => x.CacheName == cacheName);

            if (cachedItem == null)
            {
                return null;
            }

            var cacheMinutes = DateTime.UtcNow - cachedItem.LastUpdate;

            //Check if the cache time has passed, if so then return null as it will need to be updated
            if (cacheMinutes.TotalMinutes > cachedItem.MinutesToCacheFor)
            {
                return null;
            }

            Log.Information($"[Data Caching] {cacheName} pulled from the cache");
            return cachedItem.CacheData;
        }
    }
}
