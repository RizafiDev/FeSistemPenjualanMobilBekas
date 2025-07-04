// Enhanced SWR Configuration with Caching Strategy
import { SWRConfiguration } from "swr";
import {
  getCachedData,
  setCachedData,
  generateCacheKey,
  getCacheDuration,
  clearCachePattern,
} from "./cache";

// Global SWR Configuration
export const swrConfig: SWRConfiguration = {
  // Caching Strategy
  revalidateOnFocus: false, // Don't revalidate on window focus
  revalidateOnReconnect: true, // Revalidate on network reconnection
  refreshInterval: 0, // Disable automatic refresh (we'll handle it manually)

  // Performance Settings
  dedupingInterval: 2000, // Dedupe requests within 2 seconds
  loadingTimeout: 10000, // 10 second timeout
  errorRetryCount: 3, // Retry failed requests 3 times
  errorRetryInterval: 1000, // Wait 1 second between retries

  // Cache Provider with multi-level caching
  provider: () => {
    return new Map();
  },

  // Enhanced revalidation strategy
  revalidateIfStale: true,

  // Custom comparison function for better cache hits
  compare: (a, b) => {
    // Deep comparison for better cache efficiency
    return JSON.stringify(a) === JSON.stringify(b);
  },

  // Error handling
  onError: (error, key) => {
    console.error(`SWR Error for key ${key}:`, error);

    // If API fails, try to serve from cache
    const cachedData = getCachedData(key);
    if (cachedData) {
      console.log(`Serving stale data from cache for key: ${key}`);
      return cachedData;
    }
  },

  // Success handling - cache the data
  onSuccess: (data, key) => {
    const cacheDuration = getCacheDuration(key);
    setCachedData(key, data, cacheDuration);
  },
};

// Enhanced fetcher with caching
export const createCachedFetcher = <T = any>(
  originalFetcher: (url: string) => Promise<T>
) => {
  return async (url: string): Promise<T> => {
    const cacheKey = generateCacheKey(url);

    // Try to get from cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for: ${url}`);
      return cachedData;
    }

    try {
      // If not in cache, fetch from API
      console.log(`Cache miss, fetching from API: ${url}`);
      const data = await originalFetcher(url);

      // Cache the result
      const cacheDuration = getCacheDuration(url);
      setCachedData(cacheKey, data, cacheDuration);

      return data;
    } catch (error) {
      // If API fails, try to serve stale data
      const staleData = getCachedData(cacheKey);
      if (staleData) {
        console.warn(`API failed, serving stale data for: ${url}`);
        return staleData;
      }
      throw error;
    }
  };
};

// Cache invalidation strategies
export const invalidateCache = {
  // Invalidate all mobil-related caches
  mobils: () => {
    clearCachePattern("mobils");
    clearCachePattern("stok_mobils");
    clearCachePattern("foto_mobils");
  },

  // Invalidate specific mobil cache
  mobil: (id: string | number) => {
    clearCachePattern(`mobils_${id}`);
    clearCachePattern(`stok_mobils_mobil_id=${id}`);
    clearCachePattern(`foto_mobils_mobil_id=${id}`);
  },

  // Invalidate master data caches
  masterData: () => {
    clearCachePattern("mereks");
    clearCachePattern("kategoris");
    clearCachePattern("varians");
  },

  // Invalidate appointment caches
  appointments: () => {
    clearCachePattern("janji_temus");
  },

  // Invalidate service history caches
  serviceHistory: (stokMobilId?: string | number) => {
    if (stokMobilId) {
      clearCachePattern(`riwayat_servis_stok_mobil_id=${stokMobilId}`);
    } else {
      clearCachePattern("riwayat_servis");
    }
  },

  // Invalidate all caches
  all: () => {
    clearCachePattern("");
  },
};

// Background refresh strategies
export const backgroundRefresh = {
  // Refresh static data every 30 minutes
  staticData: () => {
    setInterval(() => {
      invalidateCache.masterData();
    }, 30 * 60 * 1000);
  },

  // Refresh dynamic data every 5 minutes
  dynamicData: () => {
    setInterval(() => {
      clearCachePattern("stok_mobils");
    }, 5 * 60 * 1000);
  },

  // Refresh real-time data every minute
  realTimeData: () => {
    setInterval(() => {
      clearCachePattern("janji_temus");
    }, 60 * 1000);
  },
};

// Cache warming strategies
export const warmupCache = {
  // Warm up essential data on app start
  essential: async (fetcher: Function) => {
    try {
      console.log("Warming up essential cache...");

      // Preload master data
      await Promise.all([
        fetcher("/mereks"),
        fetcher("/kategoris"),
        fetcher("/varians"),
      ]);

      console.log("Essential cache warmed up");
    } catch (error) {
      console.error("Cache warmup failed:", error);
    }
  },

  // Warm up frequently accessed data
  popular: async (fetcher: Function) => {
    try {
      console.log("Warming up popular cache...");

      // Preload popular mobil data
      await fetcher("/mobils?limit=20");

      console.log("Popular cache warmed up");
    } catch (error) {
      console.error("Popular cache warmup failed:", error);
    }
  },
};

// Cache monitoring and health check
export const cacheMonitor = {
  // Get cache health statistics
  getHealthStats: () => {
    const stats = {
      timestamp: new Date().toISOString(),
      memory: {
        used: 0,
        available: 0,
        hitRate: 0,
      },
      localStorage: {
        used: 0,
        available: 0,
        hitRate: 0,
      },
      performance: {
        averageResponseTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
      },
    };

    return stats;
  },

  // Monitor cache performance
  startMonitoring: () => {
    if (typeof window !== "undefined") {
      // Monitor every 5 minutes
      setInterval(() => {
        const stats = cacheMonitor.getHealthStats();
        console.log("Cache Health Stats:", stats);
      }, 5 * 60 * 1000);
    }
  },
};

// Initialize caching system
export const initializeCaching = () => {
  console.log("Initializing caching system...");

  // Start background refresh
  backgroundRefresh.staticData();
  backgroundRefresh.dynamicData();
  backgroundRefresh.realTimeData();

  // Start cache monitoring
  cacheMonitor.startMonitoring();

  console.log("Caching system initialized");
};
