// SWR Provider Component untuk konfigurasi global caching
"use client";

import { SWRConfig } from "swr";
import { swrConfig, initializeCaching } from "./swr-config";
import { warmupCache } from "./swr-config";
import { useEffect } from "react";

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  useEffect(() => {
    // Initialize caching system when component mounts
    initializeCaching();

    // Warm up essential cache
    const fetcher = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      return response.json();
    };

    warmupCache.essential(fetcher);

    // Warm up popular cache after 2 seconds
    setTimeout(() => {
      warmupCache.popular(fetcher);
    }, 2000);
  }, []);

  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
