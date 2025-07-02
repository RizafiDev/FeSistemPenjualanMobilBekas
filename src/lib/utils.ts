import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat("id-ID").format(number);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function createSlug(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Sensor nomor polisi dengan menyembunyikan bagian tengah
 * Contoh: B 1234 ZY -> B XXXX ZY
 */
export function sensorNoPolisi(noPolisi: string | null | undefined): string {
  if (!noPolisi || noPolisi.trim() === "") {
    return "Belum ada plat nomor";
  }

  const cleanNoPolisi = noPolisi.trim().toUpperCase();

  // Pattern untuk nomor polisi Indonesia: [Huruf] [Angka] [Huruf]
  // Contoh: B 1234 ABC, DK 5678 XY, dll
  const match = cleanNoPolisi.match(/^([A-Z]{1,2})\s+(\d+)\s+([A-Z]{1,3})$/);

  if (match) {
    const [, prefix, numbers, suffix] = match;
    // Ganti angka dengan X sejumlah digit yang sama
    const sensoredNumbers = "X".repeat(numbers.length);
    return `${prefix} ${sensoredNumbers} ${suffix}`;
  }

  // Jika format tidak sesuai, sensor bagian tengah secara umum
  if (cleanNoPolisi.length > 6) {
    const start = cleanNoPolisi.substring(0, 2);
    const end = cleanNoPolisi.substring(cleanNoPolisi.length - 2);
    return `${start}${"X".repeat(cleanNoPolisi.length - 4)}${end}`;
  }

  // Jika terlalu pendek, sensor sebagian
  return (
    cleanNoPolisi.substring(0, 1) +
    "X".repeat(Math.max(cleanNoPolisi.length - 2, 1)) +
    cleanNoPolisi.substring(cleanNoPolisi.length - 1)
  );
}

/**
 * Format nomor polisi untuk display dengan sensor
 */
export function formatNoPolisi(
  noPolisi: string | null | undefined,
  showFull: boolean = false
): string {
  if (!noPolisi || noPolisi.trim() === "") {
    return "Belum ada plat nomor";
  }

  if (showFull) {
    return noPolisi.trim().toUpperCase();
  }

  return sensorNoPolisi(noPolisi);
}
