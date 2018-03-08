using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;

namespace Sabio.Services
{
    public class MemoryCacheDefault : ICacheService
    {
        private static readonly MemoryCache Cache = MemoryCache.Default;

        private static MemoryCacheDefault _instance = null;

        static MemoryCacheDefault()
        {
            _instance = new MemoryCacheDefault();
        }

        public static MemoryCacheDefault Instance
        {
            get
            {
                return _instance;
            }
        }


        public void RemoveStartsWith(string key)
        {
            lock (Cache)
            {
                Cache.Remove(key);
            }
        }

        public T Get<T>(string key) where T : class
        {
            var o = Cache.Get(key) as T;
            return o;
        }

        public object Get(string key)
        {
            return Cache.Get(key);
        }

        public void Remove(string key)
        {
            lock (Cache)
            {
                Cache.Remove(key);
            }
        }

        public bool Contains(string key)
        {
            return Cache.Contains(key);
        }

        public void Add(string key, object o, DateTimeOffset expiration, string dependsOnKey = null)
        {
            var cachePolicy = new CacheItemPolicy
            {
                AbsoluteExpiration = expiration
            };

            if (!string.IsNullOrWhiteSpace(dependsOnKey))
            {
                cachePolicy.ChangeMonitors.Add(
                    Cache.CreateCacheEntryChangeMonitor(new[] { dependsOnKey })
                );
            }
            lock (Cache)
            {
                Cache.Add(key, o, cachePolicy);
            }
        }

        public void Add(string key, object o, string dependsOnKey = null)
        {
            DateTimeOffset dt = DateTimeOffset.Now.AddMinutes(20);

            Add(key, o, dt, dependsOnKey);
        }

        public IEnumerable<string> AllKeys
        {
            get
            {
                return Cache.Select(x => x.Key);
            }
        }
    }
}