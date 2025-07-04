// Cache Configuration and Utilities
import { SWRConfiguration } from "swr";

// Cache Constants
export const CACHE_KEYS = {
  MOBILS: "mobils",
  MOBIL_DETAIL: "mobil_detail",
  MEREKS: "mereks",
  KATEGORIS: "kategoris",
  STOK_MOBILS: "stok_mobils",
  FOTO_MOBILS: "foto_mobils",
  VARIANS: "varians",
  RIWAYAT_SERVIS: "riwayat_servis",
  JANJI_TEMUS: "janji_temus",
} as const;

// Cache Duration Configuration (in milliseconds)
export const CACHE_DURATION = {
  // Static data - cache longer (30 minutes)
  STATIC: 30 * 60 * 1000,

  // Semi-static data - cache medium (15 minutes)
  SEMI_STATIC: 15 * 60 * 1000,

  // Dynamic data - cache short (5 minutes)
  DYNAMIC: 5 * 60 * 1000,

  // Real-time data - cache very short (1 minute)
  REALTIME: 1 * 60 * 1000,

  // Critical data - cache ultra short (30 seconds)
  CRITICAL: 30 * 1000,
} as const;

// Data Categories by Cache Duration
export const CACHE_CATEGORIES = {
  STATIC: ["mereks", "kategoris", "varians"], // Rarely change
  SEMI_STATIC: ["mobils", "foto_mobils"], // Change occasionally
  DYNAMIC: ["stok_mobils"], // Change regularly
  REALTIME: ["janji_temus"], // Change frequently
  CRITICAL: ["riwayat_servis"], // Time-sensitive
} as const;

// Memory Cache Implementation
class MemoryCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();
  private maxSize = 100; // Maximum number of entries

  set(key: string, data: any, ttl: number = CACHE_DURATION.SEMI_STATIC): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if cache is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache size info
  getInfo(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

// Local Storage Cache Implementation
class LocalStorageCache {
  private prefix = "spm_cache_"; // Sistem Penjualan Mobil cache prefix

  set(key: string, data: any, ttl: number = CACHE_DURATION.SEMI_STATIC): void {
    if (typeof window === "undefined") return;

    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    try {
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("LocalStorage cache set failed:", error);
    }
  }

  get(key: string): any | null {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      if (!item) return null;

      const cacheData = JSON.parse(item);

      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > cacheData.ttl) {
        this.delete(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn("LocalStorage cache get failed:", error);
      return null;
    }
  }

  delete(key: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.warn("LocalStorage cache delete failed:", error);
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("LocalStorage cache clear failed:", error);
    }
  }

  // Get cache size info
  getInfo(): { size: number; totalSize: string } {
    if (typeof window === "undefined") return { size: 0, totalSize: "0KB" };

    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter((key) => key.startsWith(this.prefix));

      let totalSize = 0;
      cacheKeys.forEach((key) => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      });

      return {
        size: cacheKeys.length,
        totalSize: `${(totalSize / 1024).toFixed(2)}KB`,
      };
    } catch (error) {
      console.warn("LocalStorage cache info failed:", error);
      return { size: 0, totalSize: "0KB" };
    }
  }
}

// Cache Instances
export const memoryCache = new MemoryCache();
export const localStorageCache = new LocalStorageCache();

// Cache Utility Functions
export const getCacheDuration = (endpoint: string): number => {
  // Extract the main endpoint name
  const endpointName = endpoint.split("/").pop()?.split("?")[0] || "";

  // Determine cache duration based on data type
  if (CACHE_CATEGORIES.STATIC.some((cat) => endpointName.includes(cat))) {
    return CACHE_DURATION.STATIC;
  }
  if (CACHE_CATEGORIES.SEMI_STATIC.some((cat) => endpointName.includes(cat))) {
    return CACHE_DURATION.SEMI_STATIC;
  }
  if (CACHE_CATEGORIES.DYNAMIC.some((cat) => endpointName.includes(cat))) {
    return CACHE_DURATION.DYNAMIC;
  }
  if (CACHE_CATEGORIES.REALTIME.some((cat) => endpointName.includes(cat))) {
    return CACHE_DURATION.REALTIME;
  }
  if (CACHE_CATEGORIES.CRITICAL.some((cat) => endpointName.includes(cat))) {
    return CACHE_DURATION.CRITICAL;
  }

  return CACHE_DURATION.SEMI_STATIC; // Default
};

// Cache Key Generator
export const generateCacheKey = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  const baseKey = endpoint.replace(/^\//, "").replace(/\//g, "_");

  if (params && Object.keys(params).length > 0) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    return `${baseKey}_${Buffer.from(sortedParams).toString("base64")}`;
  }

  return baseKey;
};

// Multi-Level Cache Strategy
export const getCachedData = (key: string): any | null => {
  // Try memory cache first (fastest)
  let data = memoryCache.get(key);
  if (data) return data;

  // Try local storage cache (persistent)
  data = localStorageCache.get(key);
  if (data) {
    // Store in memory cache for faster access
    memoryCache.set(key, data);
    return data;
  }

  return null;
};

export const setCachedData = (key: string, data: any, ttl?: number): void => {
  const cacheDuration = ttl || CACHE_DURATION.SEMI_STATIC;

  // Store in both caches
  memoryCache.set(key, data, cacheDuration);
  localStorageCache.set(key, data, cacheDuration);
};

export const deleteCachedData = (key: string): void => {
  memoryCache.delete(key);
  localStorageCache.delete(key);
};

// Cache Pattern Matching for bulk operations
export const clearCachePattern = (pattern: string): void => {
  // Clear memory cache
  // Note: Map doesn't have pattern matching, so we'll need to iterate
  const memoryKeys = Array.from(memoryCache["cache"].keys());
  memoryKeys.forEach((key) => {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  });

  // Clear local storage cache
  if (typeof window !== "undefined") {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(`spm_cache_`) && key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Pattern cache clear failed:", error);
    }
  }
};

// Cache Statistics
export const getCacheStats = () => {
  return {
    memory: memoryCache.getInfo(),
    localStorage: localStorageCache.getInfo(),
    categories: CACHE_CATEGORIES,
    durations: CACHE_DURATION,
  };
};

// Clear all caches
export const clearAllCaches = (): void => {
  memoryCache.clear();
  localStorageCache.clear();
};
