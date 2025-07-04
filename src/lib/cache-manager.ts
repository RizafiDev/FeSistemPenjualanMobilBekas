// Cache Manager untuk kontrol caching dari UI
"use client";

import { useState, useEffect } from "react";
import {
  getCacheStats,
  clearAllCaches,
  clearCachePattern,
  CACHE_CATEGORIES,
  CACHE_DURATION,
} from "./cache";
import { invalidateCache } from "./swr-config";

export interface CacheStats {
  memory: {
    size: number;
    maxSize: number;
  };
  localStorage: {
    size: number;
    totalSize: string;
  };
  categories: typeof CACHE_CATEGORIES;
  durations: typeof CACHE_DURATION;
}

export const useCacheManager = () => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get cache statistics
  const refreshStats = async () => {
    setIsLoading(true);
    try {
      const cacheStats = getCacheStats();
      setStats(cacheStats);
    } catch (error) {
      console.error("Failed to get cache stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all caches
  const clearAll = async () => {
    setIsLoading(true);
    try {
      clearAllCaches();
      invalidateCache.all();
      await refreshStats();
      console.log("All caches cleared successfully");
    } catch (error) {
      console.error("Failed to clear all caches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear specific cache patterns
  const clearPattern = async (pattern: string) => {
    setIsLoading(true);
    try {
      clearCachePattern(pattern);
      await refreshStats();
      console.log(`Cache pattern '${pattern}' cleared successfully`);
    } catch (error) {
      console.error(`Failed to clear cache pattern '${pattern}':`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cache by category
  const clearByCategory = async (
    category: "mobils" | "master" | "appointments" | "service"
  ) => {
    setIsLoading(true);
    try {
      switch (category) {
        case "mobils":
          invalidateCache.mobils();
          break;
        case "master":
          invalidateCache.masterData();
          break;
        case "appointments":
          invalidateCache.appointments();
          break;
        case "service":
          invalidateCache.serviceHistory();
          break;
      }
      await refreshStats();
      console.log(`Cache category '${category}' cleared successfully`);
    } catch (error) {
      console.error(`Failed to clear cache category '${category}':`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Preload cache
  const preloadCache = async () => {
    setIsLoading(true);
    try {
      // This would trigger the warmup functions
      const event = new CustomEvent("cache-preload");
      window.dispatchEvent(event);
      console.log("Cache preload initiated");
    } catch (error) {
      console.error("Failed to preload cache:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    isLoading,
    refreshStats,
    clearAll,
    clearPattern,
    clearByCategory,
    preloadCache,
  };
};

// Cache Performance Monitor Hook
export const useCachePerformance = () => {
  const [metrics, setMetrics] = useState({
    hits: 0,
    misses: 0,
    hitRate: 0,
    averageResponseTime: 0,
    totalRequests: 0,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = () => {
    setIsMonitoring(true);

    // Listen for cache events
    const handleCacheHit = () => {
      setMetrics((prev) => ({
        ...prev,
        hits: prev.hits + 1,
        totalRequests: prev.totalRequests + 1,
        hitRate: ((prev.hits + 1) / (prev.totalRequests + 1)) * 100,
      }));
    };

    const handleCacheMiss = () => {
      setMetrics((prev) => ({
        ...prev,
        misses: prev.misses + 1,
        totalRequests: prev.totalRequests + 1,
        hitRate: (prev.hits / (prev.totalRequests + 1)) * 100,
      }));
    };

    // Add event listeners
    window.addEventListener("cache-hit", handleCacheHit);
    window.addEventListener("cache-miss", handleCacheMiss);

    return () => {
      window.removeEventListener("cache-hit", handleCacheHit);
      window.removeEventListener("cache-miss", handleCacheMiss);
    };
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const resetMetrics = () => {
    setMetrics({
      hits: 0,
      misses: 0,
      hitRate: 0,
      averageResponseTime: 0,
      totalRequests: 0,
    });
  };

  useEffect(() => {
    if (isMonitoring) {
      const cleanup = startMonitoring();
      return cleanup;
    }
  }, [isMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring: () => setIsMonitoring(true),
    stopMonitoring,
    resetMetrics,
  };
};

// Cache Status Hook
export const useCacheStatus = () => {
  const [status, setStatus] = useState<"healthy" | "warning" | "error">(
    "healthy"
  );
  const [message, setMessage] = useState("");

  const checkCacheHealth = async () => {
    try {
      const stats = getCacheStats();

      // Check memory usage
      const memoryUsage = (stats.memory.size / stats.memory.maxSize) * 100;

      // Check localStorage usage
      const localStorageSize = parseFloat(
        stats.localStorage.totalSize.replace("KB", "")
      );

      if (memoryUsage > 90) {
        setStatus("warning");
        setMessage("Memory cache is nearly full");
      } else if (localStorageSize > 5000) {
        // 5MB
        setStatus("warning");
        setMessage("Local storage cache is large");
      } else {
        setStatus("healthy");
        setMessage("Cache is operating normally");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to check cache health");
    }
  };

  useEffect(() => {
    checkCacheHealth();
    const interval = setInterval(checkCacheHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return { status, message, checkCacheHealth };
};
