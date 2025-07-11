"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CarSearch from "@/components/car/car-search";
import StockCarCard from "@/components/car/stock-car-card";
import ArticlesOverview from "@/components/car/articles-overview";
import HeroSection from "@/components/hero-section";
import { useCatalog, useMereks } from "@/lib/hooks";
import type { StokMobil, Merek } from "@/lib/types";
import {
  Car,
  Shield,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  MapPin,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { CarSearchFilters } from "@/lib/validations";
import { useRef } from "react";

export default function HomePage() {
  const { data: stockCarsData } = useCatalog({ page: 1 });
  const { data: mereksData } = useMereks();
  const featuredStockCars: StokMobil[] =
    stockCarsData?.data?.slice(0, 12) || [];
  const mereks: Merek[] = mereksData?.data || [];

  const sliderRef = useRef<HTMLDivElement>(null);
  const brandSliderRef = useRef<HTMLDivElement>(null); // ✅ Add brand slider ref

  const handleSearch = (filters: CarSearchFilters) => {
    // Navigate to catalog page with filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, value.toString());
      }
    });
    window.location.href = `/mobil?${params.toString()}`;
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollBrandLeft = () => {
    if (brandSliderRef.current) {
      brandSliderRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollBrandRight = () => {
    if (brandSliderRef.current) {
      brandSliderRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Brands Section */}
      {mereks.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  <Car className="h-4 w-4" />
                  Merek Terpercaya
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Merek Populer
                </h2>
                <p className="text-lg text-gray-600 max-w-xl">
                  Temukan mobil dari merek-merek terpercaya pilihan Anda dengan
                  kualitas terjamin
                </p>
              </div>

              {/* Navigation Buttons for Brands */}
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollBrandLeft}
                    className="h-10 w-10 rounded-full border-2"
                    aria-label="Scroll brands left"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollBrandRight}
                    className="h-10 w-10 rounded-full border-2"
                    aria-label="Scroll brands right"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="h-12 px-6 border-2 hover:shadow-lg transition-all duration-300"
                  asChild
                  aria-label="View all car brands"
                >
                  <Link href="/mobil">
                    Lihat Semua Merek
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Brand Slider Container */}
            <div className="relative">
              <div
                ref={brandSliderRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {mereks.map((merek) => (
                  <Link
                    key={merek.id}
                    href={`/mobil?merek=${merek.id}`}
                    className="group block flex-none "
                  >
                    {/* Brand Logo */}
                    <div className="p-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 overflow-hidden">
                      {merek.logo ? (
                        <img
                          src={`https://appsdealer.rizafidev.site/storage/${merek.logo}`}
                          alt={merek.nama}
                          className="w-24 h-24 object-contain"
                          onError={(e) => {
                            // Fallback to Car icon if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}
                      <Car
                        className={`h-8 w-8 text-gray-600 group-hover:text-blue-600 transition-colors duration-300 ${
                          merek.logo ? "hidden" : ""
                        }`}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Search Section */}
      <section className="py-20 bg-white relative overflow-hidden ">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Search className="h-4 w-4" />
              Pencarian Mobil
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Cari Mobil Impian Anda
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gunakan filter pencarian untuk menemukan mobil yang sesuai dengan
              kebutuhan dan budget Anda
            </p>
          </div>

          <CarSearch onSearch={handleSearch} showAdvancedFilters={true} />
        </div>
      </section>
      {/* Featured Cars */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white ">
        <div className="container mx-auto px-4 lg:px-8 ">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Car className="h-4 w-4" />
                Pilihan Terbaik
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Mobil Pilihan Terbaik
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">
                Koleksi mobil bekas berkualitas tinggi yang telah melewati
                inspeksi ketat
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Navigation Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollLeft}
                  className="h-10 w-10 rounded-full border-2"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollRight}
                  className="h-10 w-10 rounded-full border-2"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                className="h-12 px-6 border-2 hover:shadow-lg transition-all duration-300"
                asChild
                aria-label="Lihat Semua Mobil"
              >
                <Link href="/mobil">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Slider Container */}
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {featuredStockCars.map((stockCar) => (
                <div key={stockCar.id} className="flex-none w-80">
                  <div className="transform scale-90 origin-top">
                    <StockCarCard stockCar={stockCar} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {featuredStockCars.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Belum ada mobil tersedia
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Kami sedang mempersiapkan koleksi mobil terbaik untuk Anda.
                Silakan cek kembali nanti atau hubungi kami untuk informasi
                lebih lanjut.
              </p>
              {/* Empty state button */}
              <Button
                className="h-12 px-8"
                asChild
                aria-label="Check complete catalog"
              >
                <Link href="/mobil">Cek Katalog Lengkap</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white ">
        <div className="container mx-auto px-4 lg:px-8 ">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              <Shield className="h-4 w-4" />
              Keunggulan Kami
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Komitmen kami untuk memberikan layanan terbaik dalam jual beli
              mobil bekas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Garansi Resmi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Semua mobil dilengkapi garansi resmi dan jaminan kualitas
                  untuk memberikan ketenangan pikiran Anda.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Inspeksi Menyeluruh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Setiap mobil melalui inspeksi 100+ poin oleh teknisi
                  berpengalaman untuk memastikan kualitas terbaik.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Layanan Terpercaya</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Tim profesional siap membantu Anda dari konsultasi hingga
                  proses transaksi selesai.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Proses Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Proses pembelian yang efisien dengan bantuan digitalisasi
                  dokumen dan sistem terintegrasi.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Lokasi Strategis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Showroom di berbagai kota dengan akses mudah dan fasilitas
                  lengkap untuk kenyamanan Anda.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Car className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Pilihan Lengkap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Ribuan pilihan mobil dari berbagai merek dan tahun dengan
                  kondisi prima dan harga kompetitif.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Articles Overview Section */}
      <ArticlesOverview />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="container text-center relative z-10 mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Phone className="h-4 w-4" />
              Siap Melayani Anda
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Siap Menemukan Mobil Impian Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              Jangan tunggu lagi! Tim ahli kami siap membantu Anda menemukan
              mobil bekas berkualitas yang sesuai dengan kebutuhan dan budget.
            </p>
            {/* CTA Section buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                asChild
                aria-label="Explore car catalog"
              >
                <Link href="/mobil">
                  <Car className="mr-3 h-6 w-6" />
                  Jelajahi Katalog
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                asChild
                aria-label="Contact us for assistance"
              >
                <Link href="/kontak">
                  <Phone className="mr-3 h-6 w-6" />
                  Hubungi Kami
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
