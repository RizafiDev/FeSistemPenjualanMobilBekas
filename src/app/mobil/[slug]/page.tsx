import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCarDetailSEO } from "@/lib/seo";
import CarDetailPage from "@/components/car/car-detail-page";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

interface Props {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    stock?: string;
  }>;
}

// Helper function to fetch stock data
async function fetchStockData(stockId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/stok-mobils/${stockId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthHeaders(),
      },
      // Add cache control for better performance
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data; // Handle different API response formats
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Extract stock ID from query params or slug
  let stockId: string = "1"; // Default fallback

  // 1. Check if stock ID is in query params (e.g., ?stock=123)
  if (resolvedSearchParams?.stock) {
    stockId = resolvedSearchParams.stock;
  } else {
    // 2. Extract from slug - assume last part is stock ID
    const slugParts = resolvedParams.slug.split("-");
    const lastPart = slugParts[slugParts.length - 1];

    // Check if last part is a number (stock ID)
    if (!isNaN(Number(lastPart)) && lastPart !== "") {
      stockId = lastPart;
    } else {
      // Try to find any number in the slug
      for (let i = slugParts.length - 1; i >= 0; i--) {
        if (!isNaN(Number(slugParts[i])) && slugParts[i] !== "") {
          stockId = slugParts[i];
          break;
        }
      }
    }
  }

  try {
    // Fetch actual stock data from API
    const stockData = await fetchStockData(stockId);

    if (!stockData) {
      return {
        title: "Mobil Tidak Ditemukan | Toko Jaya Motor",
        description: "Mobil yang Anda cari tidak tersedia.",
      };
    }

    // Create car object for SEO
    const carForSEO = {
      nama:
        stockData.nama_lengkap ||
        `${stockData.mobil?.nama} ${stockData.varian?.nama}`,
      merek: {
        nama: stockData.mobil?.merek?.nama || "Unknown",
      },
      harga: stockData.harga_jual || 0,
      deskripsi:
        stockData.catatan ||
        stockData.mobil?.deskripsi ||
        "Mobil berkualitas dengan kondisi prima",
      tahun: stockData.tahun || stockData.mobil?.tahun_mulai,
      warna: stockData.warna,
      kondisi: stockData.kondisi,
      lokasi: stockData.lokasi,
      kilometer: stockData.kilometer,
    };

    return getCarDetailSEO(carForSEO);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Mobil Tidak Ditemukan | Toko Jaya Motor",
      description: "Mobil yang Anda cari tidak tersedia.",
    };
  }
}

export default async function CarDetailPageRoute({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Debug logging
  console.log("Debug - Full slug:", resolvedParams.slug);
  console.log("Debug - Search params:", resolvedSearchParams);

  // Extract stock ID - check query params first, then slug
  let stockId: string = "1"; // Default fallback

  // 1. Check if stock ID is in query params (e.g., ?stock=123)
  if (resolvedSearchParams?.stock) {
    stockId = resolvedSearchParams.stock;
    console.log("Debug - Stock ID from query params:", stockId);
  } else {
    // 2. Extract from slug - assume last part is stock ID
    // Format: hyundai-ioniq-5-2022-3-stock-3 -> stockId = "3"
    const slugParts = resolvedParams.slug.split("-");
    console.log("Debug - Slug parts:", slugParts);

    const lastPart = slugParts[slugParts.length - 1];
    console.log("Debug - Last part:", lastPart);

    // Check if last part is a number (stock ID)
    if (!isNaN(Number(lastPart)) && lastPart !== "") {
      stockId = lastPart;
      console.log("Debug - Stock ID from last part:", stockId);
    } else {
      // 3. Try different patterns
      // Maybe the format is different, let's try to find any number
      for (let i = slugParts.length - 1; i >= 0; i--) {
        if (!isNaN(Number(slugParts[i])) && slugParts[i] !== "") {
          stockId = slugParts[i];
          console.log("Debug - Stock ID found at index", i, ":", stockId);
          break;
        }
      }
    }
  }

  console.log("Debug - Final stock ID:", stockId);

  // Always render the page - let CarDetailPage handle invalid stock IDs
  return <CarDetailPage stockId={stockId} />;
}
