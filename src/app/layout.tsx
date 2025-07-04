import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/layout";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default:
      "Sistem Penjualan Mobil Bekas - Platform Terpercaya #1 di Indonesia",
    template: "%s | Sistem Penjualan Mobil Bekas",
  },
  description:
    "Temukan mobil bekas berkualitas dengan harga terbaik. Ribuan pilihan mobil dari berbagai merek dengan garansi resmi, inspeksi menyeluruh, dan layanan terpercaya. Konsultasi gratis tersedia.",
  keywords: [
    "mobil bekas",
    "jual beli mobil",
    "mobil second",
    "showroom mobil",
    "garansi mobil bekas",
    "inspeksi mobil",
    "konsultasi mobil",
  ],
  authors: [{ name: "Sistem Penjualan Mobil Bekas" }],
  creator: "Sistem Penjualan Mobil Bekas",
  publisher: "Sistem Penjualan Mobil Bekas",
  openGraph: {
    title: "Sistem Penjualan Mobil Bekas - Platform Terpercaya #1",
    description:
      "Temukan mobil bekas berkualitas dengan harga terbaik. Garansi resmi dan layanan terpercaya.",
    type: "website",
    locale: "id_ID",
    url: "https://yourdomain.com",
    siteName: "Sistem Penjualan Mobil Bekas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistem Penjualan Mobil Bekas - Platform Terpercaya #1",
    description:
      "Temukan mobil bekas berkualitas dengan harga terbaik. Garansi resmi dan layanan terpercaya.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Layout>{children}</Layout>
        <Toaster />
      </body>
    </html>
  );
}
