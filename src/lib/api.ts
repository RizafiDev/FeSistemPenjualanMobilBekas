// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/admin";

// API Key Configuration
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// Import types for transformation
import type { Mobil, FotoMobil } from "./types";

// API Endpoints
export const API_ENDPOINTS = {
  ARTICLES: "/articles",
  FOTO_MOBILS: "/foto-mobils",
  HOMEPAGES: "/homepages",
  JANJI_TEMUS: "/janji-temus",
  KATEGORIS: "/kategoris",
  MEREKS: "/mereks",
  MOBILS: "/mobils",
  RIWAYAT_SERVIS: "/riwayat-servis",
  STOK_MOBILS: "/stok-mobils",
  VARIANS: "/varians", // ✅ Added missing endpoint
} as const;

// Authentication headers helper
export const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add API key to headers if available
  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
  }

  return headers;
};

// API Helper Functions
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Image URL helper
export const getImageUrl = (path: string): string => {
  if (!path) return "/images/car-placeholder.jpg";

  // If already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // For storage paths, prefix with storage URL
  const STORAGE_BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://127.0.0.1:8000/storage";

  // If starts with /storage, remove it since STORAGE_BASE_URL already includes it
  if (path.startsWith("/storage/")) {
    return `${STORAGE_BASE_URL.replace("/storage", "")}${path}`;
  }

  // If starts with /, return as is (already relative to domain)
  if (path.startsWith("/")) {
    return `${STORAGE_BASE_URL}${path}`;
  }

  // Otherwise, add it to the storage URL
  const fullUrl = `${STORAGE_BASE_URL}/${path}`;
  return fullUrl;
};

// Article image URL helper
export const getArticleImageUrl = (path: string): string => {
  if (!path) return "/images/article-placeholder.jpg";

  // If already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // For article images, use the base URL without storage prefix
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/admin", "") ||
    "http://127.0.0.1:8000";

  // If starts with /, use it as is with base URL
  if (path.startsWith("/")) {
    return `${BASE_URL}${path}`;
  }

  // Otherwise, add it to the storage URL
  return `${BASE_URL}/storage/${path}`;
};

// Data transformation utilities to handle API response differences
export const transformMobilData = (mobil: any): Mobil => {
  return {
    ...mobil,
    // Handle legacy field names for backward compatibility
    nama_mobil: mobil.nama || mobil.nama_mobil,
    tahun_produksi: mobil.tahun_mulai || mobil.tahun_produksi,
    spesifikasi: mobil.fitur_unggulan || mobil.spesifikasi,
  };
};

export const transformFotoMobilData = (foto: any): FotoMobil => {
  return {
    ...foto,
    // Handle different field names and ensure proper URL format
    url_foto: getImageUrl(foto.path_file || foto.url_foto),
    path_file: getImageUrl(foto.path_file || foto.url_foto),
    deskripsi: foto.keterangan || foto.deskripsi,
    // Determine if primary photo based on urutan_tampil
    is_primary: foto.urutan_tampil === 1 || foto.is_primary || false,
  };
};

// Fetch wrapper with error handling and authentication
export const apiFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        console.error("API Authentication Error: Invalid or missing API key");
        throw new Error("Authentication required. Please check your API key.");
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Enhanced fetch wrapper with data transformation and error handling
export const apiSafeFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Enhanced error handling
      const errorText = await response.text();
      console.error(`API Error [${response.status}]:`, errorText);

      // Handle authentication errors
      if (response.status === 401) {
        console.error("API Authentication Error: Invalid or missing API key");
        throw new Error("Authentication required. Please check your API key.");
      }

      // Try to parse error as JSON
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(
          errorJson.message || `HTTP error! status: ${response.status}`
        );
      } catch {
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
