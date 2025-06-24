"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Car, Phone, Search } from "lucide-react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Remove hooks temporarily to isolate the issue
    // const { data: mereksData } = useMereks();
    // const { data: kategorisData } = useKategoris();

    // Mock data for now
    const mereks: any[] = [];
    const kategoris: any[] = [];

    const mainNavItems = [
        { href: "/", label: "Beranda" },
        { href: "/mobil", label: "Katalog Mobil" },
        { href: "/janji-temu", label: "Buat Janji Temu" },
        { href: "/kontak", label: "Kontak" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Car className="h-6 w-6" />
                    <span className="text-xl font-bold">MobilBekas</span>
                </Link>{" "}
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Beranda
                    </Link>
                    <Link
                        href="/mobil"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Katalog
                    </Link>
                    <Link
                        href="/janji-temu"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Janji Temu
                    </Link>
                    <Link
                        href="/kontak"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Kontak
                    </Link>
                </nav>
                {/* Desktop CTA Buttons */}{" "}
                <div className="hidden md:flex items-center space-x-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/mobil">
                            <Search className="mr-2 h-4 w-4" />
                            Cari Mobil
                        </Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/kontak">
                            <Phone className="mr-2 h-4 w-4" />
                            Hubungi Kami
                        </Link>
                    </Button>
                </div>
                {/* Mobile Menu */}
                <Sheet
                    open={isMobileMenuOpen}
                    onOpenChange={setIsMobileMenuOpen}
                >
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">
                                Toggle navigation menu
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-[300px] sm:w-[400px]"
                    >
                        <nav className="flex flex-col space-y-4">
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center text-lg font-medium transition-colors hover:text-primary"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {mereks.length > 0 && (
                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-medium mb-2">
                                        Merek Populer
                                    </h4>
                                    {mereks.slice(0, 3).map((merek) => (
                                        <Link
                                            key={merek.id}
                                            href={`/brand/${merek.id}`}
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="block py-2 text-sm text-muted-foreground hover:text-primary"
                                        >
                                            {merek.nama_merek}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {kategoris.length > 0 && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">
                                        Kategori
                                    </h4>
                                    {kategoris.slice(0, 3).map((kategori) => (
                                        <Link
                                            key={kategori.id}
                                            href={`/category/${kategori.id}`}
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="block py-2 text-sm text-muted-foreground hover:text-primary"
                                        >
                                            {kategori.nama_kategori}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col space-y-2 pt-4">
                                <Button asChild>
                                    <Link
                                        href="/catalog"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Cari Mobil
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link
                                        href="/appointment"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Phone className="mr-2 h-4 w-4" />
                                        Hubungi Kami
                                    </Link>
                                </Button>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
