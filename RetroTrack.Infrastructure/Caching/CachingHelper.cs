﻿using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Models;
using Serilog;

namespace RetroTrack.Infrastructure.Caching
{
    public class CachingHelper
    {
        public static void AddOrUpdateCacheItem(string cacheName, string jsonData, int minutesToCacheFor = 10)
        {
            using (var context = new DatabaseContext())
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
        }

        public static string? GetCacheItem(string cacheName)
        {
            using (var context = new DatabaseContext())
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
}