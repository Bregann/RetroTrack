using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces
{
    public interface ICachingService
    {
        void AddOrUpdateCacheItem(string cacheName, string jsonData, int minutesToCacheFor = 10);
        string? GetCacheItem(string cacheName);
    }
}
