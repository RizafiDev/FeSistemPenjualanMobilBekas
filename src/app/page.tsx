"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CarSearch from "@/components/car/car-search";
import StockCarCard from "@/components/car/stock-car-card";
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
} from "lucide-react";
import type { CarSearchFilters } from "@/lib/validations";

export default function HomePage() {
    const { data: stockCarsData } = useCatalog({ page: 1 }); // Ambil stok mobil yang tersedia
    const { data: mereksData } = useMereks();
    const featuredStockCars: StokMobil[] =
        stockCarsData?.data?.slice(0, 6) || [];
    const mereks: Merek[] = mereksData?.data || [];

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
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Badge variant="secondary" className="w-fit">
                                    Platform Terpercaya #1 di Indonesia
                                </Badge>
                                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    Temukan
                                    <span className="text-blue-600 block">
                                        Mobil Bekas
                                    </span>
                                    Impian Anda
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Ribuan pilihan mobil bekas berkualitas
                                    dengan harga terbaik. Garansi resmi,
                                    pemeriksaan menyeluruh, dan layanan
                                    terpercaya.
                                </p>
                            </div>
                            {/* Statistics */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        1000+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Mobil Tersedia
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        50K+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Pelanggan Puas
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        98%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Rating Kepuasan
                                    </div>
                                </div>
                            </div>
                            {/* CTA Buttons */}{" "}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" asChild>
                                    <Link href="/mobil">
                                        Lihat Semua Mobil
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/janji-temu">
                                        <Phone className="mr-2 h-5 w-5" />
                                        Konsultasi Gratis
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative">
                            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
                                <div className="w-full h-full flex items-center justify-center">
                                    <Car className="h-24 w-24 text-gray-400" />
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 max-w-[200px]">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium">
                                        Garansi Resmi
                                    </span>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 max-w-[200px]">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="text-sm font-medium">
                                        Rating 4.9/5
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-16 bg-white">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Cari Mobil Impian Anda
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Gunakan filter pencarian untuk menemukan mobil yang
                            sesuai dengan kebutuhan dan budget Anda
                        </p>
                    </div>

                    <CarSearch
                        onSearch={handleSearch}
                        showAdvancedFilters={true}
                    />
                </div>
            </section>

            {/* Featured Cars */}
            <section className="py-16 bg-gray-50">
                <div className="container">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Mobil Pilihan Terbaik
                            </h2>
                            <p className="text-gray-600">
                                Koleksi mobil bekas berkualitas tinggi yang
                                telah melewati inspeksi ketat
                            </p>
                        </div>{" "}
                        <Button variant="outline" asChild>
                            <Link href="/mobil">
                                Lihat Semua
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>{" "}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredStockCars.map((stockCar) => (
                            <StockCarCard
                                key={stockCar.id}
                                stockCar={stockCar}
                            />
                        ))}
                    </div>
                    {featuredStockCars.length === 0 && (
                        <div className="text-center py-12">
                            <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Belum ada mobil tersedia
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Kami sedang mempersiapkan koleksi mobil terbaik
                                untuk Anda
                            </p>{" "}
                            <Button asChild>
                                <Link href="/mobil">Cek Katalog Lengkap</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Mengapa Memilih Kami?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Komitmen kami untuk memberikan layanan terbaik dalam
                            jual beli mobil bekas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <CardTitle>Garansi Resmi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Semua mobil dilengkapi garansi resmi dan
                                    jaminan kualitas untuk memberikan ketenangan
                                    pikiran Anda.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="h-8 w-8 text-green-600" />
                                </div>
                                <CardTitle>Inspeksi Menyeluruh</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Setiap mobil melalui inspeksi 100+ poin oleh
                                    teknisi berpengalaman untuk memastikan
                                    kualitas terbaik.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-purple-600" />
                                </div>
                                <CardTitle>Layanan Terpercaya</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Tim profesional siap membantu Anda dari
                                    konsultasi hingga proses transaksi selesai.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-8 w-8 text-yellow-600" />
                                </div>
                                <CardTitle>Proses Cepat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Proses pembelian yang efisien dengan bantuan
                                    digitalisasi dokumen dan sistem
                                    terintegrasi.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-red-600" />
                                </div>
                                <CardTitle>Lokasi Strategis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Showroom di berbagai kota dengan akses mudah
                                    dan fasilitas lengkap untuk kenyamanan Anda.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Car className="h-8 w-8 text-indigo-600" />
                                </div>
                                <CardTitle>Pilihan Lengkap</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Ribuan pilihan mobil dari berbagai merek dan
                                    tahun dengan kondisi prima dan harga
                                    kompetitif.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            {mereks.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Merek Populer
                            </h2>
                            <p className="text-gray-600">
                                Temukan mobil dari merek-merek terpercaya
                                pilihan Anda
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {mereks.slice(0, 12).map((merek) => (
                                <Link
                                    key={merek.id}
                                    href={`/mobil?merek=${merek.id}`}
                                    className="group block"
                                >
                                    <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                                        <CardContent className="p-6">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                                                <Car className="h-8 w-8 text-gray-600 group-hover:text-blue-600" />
                                            </div>{" "}
                                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {merek.nama}
                                            </h3>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>{" "}
                        <div className="text-center mt-8">
                            <Button variant="outline" asChild>
                                <Link href="/mobil">
                                    Lihat Semua Merek
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="container text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Siap Menemukan Mobil Impian Anda?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Jangan tunggu lagi! Tim ahli kami siap membantu Anda
                            menemukan mobil bekas berkualitas yang sesuai dengan
                            kebutuhan dan budget.
                        </p>{" "}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/mobil">
                                    <Car className="mr-2 h-5 w-5" />
                                    Jelajahi Katalog
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-white border-white hover:bg-white hover:text-blue-600"
                                asChild
                            >
                                <Link href="/janji-temu">
                                    <Phone className="mr-2 h-5 w-5" />
                                    Hubungi Kami{" "}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
