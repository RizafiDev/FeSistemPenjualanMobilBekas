"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useStokMobil } from "@/lib/hooks"; // ✅ Use stock data directly
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Calendar,
  Fuel,
  Gauge,
  Settings,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  Car,
  FileText,
  Shield,
  Award,
  Play,
} from "lucide-react";
import { toast } from "sonner";

interface CarDetailPageProps {
  stockId: string; // ✅ Changed from carId to stockId
}

export default function CarDetailPage({ stockId }: CarDetailPageProps) {
  // ✅ Hooks
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Fetch stock data using the corrected SWR hook
  const {
    data: stockData,
    isLoading: stockLoading,
    error: stockError,
  } = useStokMobil(stockId);

  // ✅ Process data after hooks
  const stokMobil = stockData ? (stockData as any).data : null;
  const carData = stokMobil?.mobil;
  const varianData = stokMobil?.varian;
  const riwayatServis = stokMobil?.riwayat_servis || [];

  // ✅ Get photos from foto_kondisi_urls
  const allImages = stokMobil?.foto_kondisi_urls || [];

  // ✅ Auto-select first image
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [stockId]);

  // ✅ Handle loading state
  if (stockLoading) {
    return <CarDetailSkeleton />;
  }

  // ✅ Handle error state - only show 404 for actual 404 errors
  if (stockError) {
    // Check if it's actually a 404 error
    if (stockError.message?.includes("404") || stockError.status === 404) {
      notFound();
    }

    // For other errors, show an error message instead of 404
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Terjadi Kesalahan
          </h1>
          <p className="text-gray-600 mb-4">
            Maaf, terjadi kesalahan saat memuat data mobil. Silakan coba lagi.
          </p>
          <Button onClick={() => window.location.reload()}>Muat Ulang</Button>
        </div>
      </div>
    );
  }

  // ✅ Handle missing data
  if (!stokMobil || !carData) {
    notFound();
  }

  // ✅ Event handlers
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${carData.nama} - ${carData.merek?.nama}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin!");
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Dihapus dari favorit" : "Ditambah ke favorit");
  };

  const handleAppointment = () => {
    toast.info("Fitur janji temu akan segera tersedia");
  };

  const handleContact = () => {
    const message = `Halo, saya tertarik dengan mobil ${carData.nama} ${
      varianData?.nama || ""
    } warna ${stokMobil.warna || ""} dengan harga ${formatCurrency(
      stokMobil.harga_jual || 0
    )}`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">
            Beranda
          </Link>
          <span className="mx-2">/</span>
          <Link href="/mobil" className="hover:text-primary">
            Katalog
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/merek/${carData.merek?.id}`}
            className="hover:text-primary"
          >
            {carData.merek?.nama}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{carData.nama}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {allImages.length > 0 ? (
                    <>
                      <div className="relative h-96 bg-gray-100 rounded-t-lg overflow-hidden">
                        <Image
                          src={
                            allImages[currentImageIndex] ||
                            "/images/car-placeholder.jpg"
                          }
                          alt={`${carData.nama} - Photo ${
                            currentImageIndex + 1
                          }`}
                          fill
                          className="object-cover cursor-pointer"
                          onClick={() => setIsImageModalOpen(true)}
                        />

                        {/* Navigation Arrows */}
                        {allImages.length > 1 && (
                          <>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute left-4 top-1/2 transform -translate-y-1/2"
                              onClick={() =>
                                setCurrentImageIndex(
                                  currentImageIndex === 0
                                    ? allImages.length - 1
                                    : currentImageIndex - 1
                                )
                              }
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2"
                              onClick={() =>
                                setCurrentImageIndex(
                                  currentImageIndex === allImages.length - 1
                                    ? 0
                                    : currentImageIndex + 1
                                )
                              }
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {allImages.length}
                        </div>

                        {/* View All Photos Button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-4 left-4"
                          onClick={() => setIsImageModalOpen(true)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Semua Foto
                        </Button>
                      </div>

                      {/* Thumbnail Gallery */}
                      {allImages.length > 1 && (
                        <div className="p-4">
                          <div className="flex gap-2 overflow-x-auto">
                            {allImages.map((image: string, index: number) => (
                              <button
                                key={`thumb-${index}`}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                                  currentImageIndex === index
                                    ? "border-primary"
                                    : "border-gray-200"
                                }`}
                              >
                                <Image
                                  src={image || "/images/car-placeholder.jpg"}
                                  alt={`Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-96 bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Car className="w-16 h-16 mx-auto mb-2" />
                        <p>Foto tidak tersedia</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Car Details Tabs */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
                    <TabsTrigger value="history">Riwayat</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Deskripsi</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {carData.deskripsi || "Deskripsi tidak tersedia."}
                      </p>

                      <h4 className="text-md font-semibold mt-6">
                        Fitur Unggulan
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          <span>Kondisi Terawat</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          <span>Garansi Kualitas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <span>Dokumen Lengkap</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-primary" />
                          <span>Siap Pakai</span>
                        </div>
                      </div>

                      {/* Stock Information */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-md font-semibold mb-3">
                          Informasi Stok
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">No. Rangka:</span>
                            <span className="ml-2 font-medium">
                              {stokMobil.no_rangka}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">No. Mesin:</span>
                            <span className="ml-2 font-medium">
                              {stokMobil.no_mesin}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Warna:</span>
                            <span className="ml-2 font-medium">
                              {stokMobil.warna}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Kondisi:</span>
                            <Badge variant="outline" className="ml-2">
                              {stokMobil.kondisi?.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="specs" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Spesifikasi Teknis
                      </h3>
                      {varianData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Mesin */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-primary">
                              Mesin
                            </h4>
                            <div className="space-y-2">
                              {varianData.tipe_mesin && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Tipe Mesin:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.tipe_mesin}
                                  </span>
                                </div>
                              )}
                              {varianData.kapasitas_mesin_cc && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Kapasitas:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.kapasitas_mesin_cc} cc
                                  </span>
                                </div>
                              )}
                              {varianData.silinder && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Silinder:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.silinder}
                                  </span>
                                </div>
                              )}
                              {varianData.daya_hp && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Daya:</span>
                                  <span className="font-medium">
                                    {varianData.daya_hp} HP
                                  </span>
                                </div>
                              )}
                              {varianData.torsi_nm && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Torsi:</span>
                                  <span className="font-medium">
                                    {varianData.torsi_nm} Nm
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Transmisi & Bahan Bakar */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-primary">
                              Transmisi & Bahan Bakar
                            </h4>
                            <div className="space-y-2">
                              {varianData.transmisi && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Transmisi:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.transmisi}
                                  </span>
                                </div>
                              )}
                              {varianData.jumlah_gigi && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Jumlah Gigi:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.jumlah_gigi}
                                  </span>
                                </div>
                              )}
                              {varianData.jenis_bahan_bakar && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Bahan Bakar:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.jenis_bahan_bakar}
                                  </span>
                                </div>
                              )}
                              {varianData.konsumsi_bahan_bakar_kota && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Konsumsi BB (Kota):
                                  </span>
                                  <span className="font-medium">
                                    {varianData.konsumsi_bahan_bakar_kota} km/L
                                  </span>
                                </div>
                              )}
                              {varianData.konsumsi_bahan_bakar_jalan && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Konsumsi BB (Jalan):
                                  </span>
                                  <span className="font-medium">
                                    {varianData.konsumsi_bahan_bakar_jalan} km/L
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Dimensi */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-primary">
                              Dimensi
                            </h4>
                            <div className="space-y-2">
                              {varianData.panjang_mm && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Panjang:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.panjang_mm} mm
                                  </span>
                                </div>
                              )}
                              {varianData.lebar_mm && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Lebar:</span>
                                  <span className="font-medium">
                                    {varianData.lebar_mm} mm
                                  </span>
                                </div>
                              )}
                              {varianData.tinggi_mm && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tinggi:</span>
                                  <span className="font-medium">
                                    {varianData.tinggi_mm} mm
                                  </span>
                                </div>
                              )}
                              {varianData.jarak_sumbu_roda_mm && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Jarak Sumbu Roda:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.jarak_sumbu_roda_mm} mm
                                  </span>
                                </div>
                              )}
                              {varianData.ground_clearance_mm && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Ground Clearance:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.ground_clearance_mm} mm
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Kapasitas & Performa */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-primary">
                              Kapasitas & Performa
                            </h4>
                            <div className="space-y-2">
                              {varianData.berat_kosong_kg && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Berat Kosong:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.berat_kosong_kg} kg
                                  </span>
                                </div>
                              )}
                              {varianData.kapasitas_bagasi_l && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Kapasitas Bagasi:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.kapasitas_bagasi_l} L
                                  </span>
                                </div>
                              )}
                              {varianData.kapasitas_tangki_l && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Kapasitas Tangki:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.kapasitas_tangki_l} L
                                  </span>
                                </div>
                              )}
                              {varianData.akselerasi_0_100_kmh && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Akselerasi 0-100 km/h:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.akselerasi_0_100_kmh} detik
                                  </span>
                                </div>
                              )}
                              {varianData.kecepatan_maksimal_kmh && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Kecepatan Maksimal:
                                  </span>
                                  <span className="font-medium">
                                    {varianData.kecepatan_maksimal_kmh} km/h
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Spesifikasi detail tidak tersedia.
                        </p>
                      )}

                      {/* ✅ Fitur Keselamatan, Kenyamanan, dan Hiburan */}
                      {varianData && (
                        <div className="mt-8 space-y-6">
                          {/* Fitur Keselamatan */}
                          {varianData.fitur_keamanan &&
                            varianData.fitur_keamanan.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-primary mb-3">
                                  Fitur Keselamatan
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {varianData.fitur_keamanan.map(
                                    (fitur: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <Shield className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">{fitur}</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Fitur Kenyamanan */}
                          {varianData.fitur_kenyamanan &&
                            varianData.fitur_kenyamanan.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-primary mb-3">
                                  Fitur Kenyamanan
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {varianData.fitur_kenyamanan.map(
                                    (fitur: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <Settings className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm">{fitur}</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Fitur Hiburan */}
                          {varianData.fitur_hiburan &&
                            varianData.fitur_hiburan.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-primary mb-3">
                                  Fitur Hiburan
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {varianData.fitur_hiburan.map(
                                    (fitur: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <Play className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm">{fitur}</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Riwayat Perawatan
                      </h3>
                      {riwayatServis && riwayatServis.length > 0 ? (
                        <div className="space-y-3">
                          {riwayatServis.map((service: any) => (
                            <Card key={service.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">
                                      {service.jenis_servis}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {service.deskripsi}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {new Date(
                                        service.tanggal_servis
                                      ).toLocaleDateString("id-ID")}
                                      {service.tempat_servis &&
                                        ` - ${service.tempat_servis}`}
                                    </p>
                                    {service.kilometer_servis && (
                                      <p className="text-sm text-gray-500">
                                        Kilometer:{" "}
                                        {formatNumber(service.kilometer_servis)}{" "}
                                        km
                                      </p>
                                    )}
                                  </div>
                                  {service.biaya && (
                                    <span className="text-sm font-medium">
                                      {formatCurrency(service.biaya)}
                                    </span>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Belum ada riwayat perawatan untuk kendaraan ini.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Car Info Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{carData.nama}</CardTitle>
                    <p className="text-gray-600">
                      {carData.merek?.nama} •{" "}
                      {stokMobil.tahun || carData.tahun_mulai}
                    </p>
                    {varianData?.nama && (
                      <p className="text-sm text-gray-500">{varianData.nama}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleFavorite}
                      className={isFavorite ? "text-red-500" : ""}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Price */}
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatCurrency(stokMobil.harga_jual)}
                </div>

                {/* Color Info */}
                <div className="text-sm text-gray-600 mb-4">
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    {stokMobil.warna}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <Badge
                    variant={
                      stokMobil.status === "tersedia" ? "default" : "secondary"
                    }
                  >
                    {stokMobil.status === "tersedia"
                      ? "Tersedia"
                      : stokMobil.status === "terjual"
                      ? "Terjual"
                      : stokMobil.status === "booking"
                      ? "Booking"
                      : "Tidak Tersedia"}
                  </Badge>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {stokMobil.tahun || carData.tahun_mulai}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {varianData?.transmisi || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {varianData?.jenis_bahan_bakar || "N/A"}
                    </span>
                  </div>
                  {stokMobil.kilometer && (
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {formatNumber(stokMobil.kilometer)} km
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleAppointment}
                    disabled={stokMobil.status !== "tersedia"}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Buat Janji Temu
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleContact}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Hubungi via WhatsApp
                  </Button>

                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Telepon Langsung
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Showroom Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lokasi Showroom</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Toko Jaya Motor</p>
                      <p className="text-sm text-gray-600">
                        Jl. Raya Utama No. 123
                        <br />
                        Jakarta Selatan, DKI Jakarta 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">+62 812-3456-7890</p>
                      <p className="text-sm text-gray-600">
                        Senin - Sabtu: 08:00 - 17:00
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    Lihat di Maps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Image Modal */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Galeri Foto - {carData.nama}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {allImages.map((image: string, index: number) => (
                <div key={`modal-${index}`} className="relative aspect-video">
                  <Image
                    src={image}
                    alt={`${carData.nama} - Photo ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Loading skeleton component
function CarDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="h-4 w-64 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="h-96 bg-gray-200 rounded-t-lg animate-pulse"></div>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-16 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-full bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
