"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useHomepage, useCatalog } from "@/lib/hooks";
import { getImageUrl } from "@/lib/api";
import {
  Car,
  ArrowRight,
  CheckCircle,
  Star,
  Phone,
  Loader2,
} from "lucide-react";

export default function HeroSection() {
  const { data: homepageData, isLoading, error } = useHomepage();
  const { data: catalogData } = useCatalog(); // Use catalog which already filters for 'tersedia'
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<number[]>([]);

  // Get homepage data
  const homepage = homepageData?.data?.[0];
  const heroImages = homepage?.foto_homepage || [];
  const pelangganPuas = homepage?.pelanggan_puas || "50K+";
  const ratingPuas = homepage?.rating_puas || "98";

  // Calculate available stock count from catalog data length
  const mobilTersedia = catalogData?.data?.length || 0;

  // Filter out images that failed to load
  const validImages = heroImages.filter(
    (_, index) => !imageLoadErrors.includes(index)
  );

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (validImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [validImages.length]);

  // Handle image load errors
  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => [...prev, index]);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Image - Shows first on mobile, second on desktop */}
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-white/20">
              {isLoading ? (
                // Loading state
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
                    <p className="text-gray-600 font-medium">
                      Memuat gambar...
                    </p>
                  </div>
                </div>
              ) : error ? (
                // Error state
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
                  <div className="text-center space-y-4">
                    <Car className="h-24 w-24 text-red-500 mx-auto" />
                    <p className="text-gray-600 font-medium">
                      Gagal memuat gambar
                    </p>
                  </div>
                </div>
              ) : validImages.length > 0 ? (
                <div className="relative w-full h-full">
                  {heroImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex &&
                        !imageLoadErrors.includes(index)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Hero image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                        onError={() => handleImageError(index)}
                      />
                    </div>
                  ))}

                  {/* Image Indicators */}
                  {validImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {validImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "bg-white shadow-lg"
                              : "bg-white/50 hover:bg-white/70"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Fallback when no images
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="text-center space-y-4">
                    <Car className="h-24 w-24 text-blue-500 mx-auto" />
                    <p className="text-gray-600 font-medium">
                      Foto Mobil Unggulan
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-xl p-4 max-w-[200px] border border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  Garansi Resmi
                </span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-4 max-w-[200px] border border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  Rating 4.9/5
                </span>
              </div>
            </div>
          </div>

          {/* Text Content - Shows second on mobile, first on desktop */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="w-fit px-4 py-2 bg-blue-100 text-blue-700 border-blue-200"
              >
                🏆 Platform Terpercaya #1 di Indonesia
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Temukan
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text block">
                  Mobil Bekas
                </span>
                Impian Anda
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Ribuan pilihan mobil bekas berkualitas dengan harga terbaik.
                Garansi resmi, pemeriksaan menyeluruh, dan layanan terpercaya.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {mobilTersedia}+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Mobil Tersedia
                </div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {pelangganPuas}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Pelanggan Puas
                </div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {ratingPuas}%
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Rating Kepuasan
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
                aria-label="Browse all available cars"
              >
                <Link href="/mobil">
                  Lihat Semua Mobil
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-2 hover:bg-white hover:shadow-lg transition-all duration-300"
                asChild
                aria-label="Get free consultation"
              >
                <Link href="/kontak">
                  <Phone className="mr-2 h-5 w-5" />
                  Konsultasi Gratis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
