import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCarDetailSEO } from "@/lib/seo";
import CarDetailPage from "@/components/car/car-detail-page";

interface Props {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    stock?: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Extract stock ID from query params or slug
  const stockId =
    resolvedSearchParams?.stock || resolvedParams.slug.split("-").pop();

  try {
    // In real app, fetch stock data here
    // const stockData = await fetchStockById(stockId)
    const mockCar = {
      nama: "Toyota Avanza",
      merek: { nama: "Toyota" },
      harga: 150000000,
      deskripsi: "Mobil keluarga yang nyaman dan irit bahan bakar",
    };

    return getCarDetailSEO(mockCar);
  } catch {
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
