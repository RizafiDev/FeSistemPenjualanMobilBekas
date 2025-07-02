// Base types
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

// Merek (Brand) interface - Fixed to match backend model
export interface Merek extends BaseModel {
  nama: string; // ✅ Fixed from 'nama_merek' to 'nama'
  slug?: string; // ✅ Added missing field
  logo?: string; // ✅ Fixed from 'logo_url'
  negara_asal?: string; // ✅ Added missing field
  deskripsi?: string;
  tahun_berdiri?: number; // ✅ Added missing field
  aktif?: boolean; // ✅ Added missing field
}

// Kategori (Category) interface - Fixed to match backend model
export interface Kategori extends BaseModel {
  nama: string; // ✅ Fixed from 'nama_kategori' to 'nama'
  slug?: string; // ✅ Added missing field
  deskripsi?: string;
  ikon?: string; // ✅ Added missing field
  urutan_tampil?: number; // ✅ Added missing field
  unggulan?: boolean; // ✅ Added missing field
}

// Mobil (Car) interface - Fixed to match API response
// Mobil (Car) interface - Fixed to match API response
export interface Mobil extends BaseModel {
  nama: string; // ✅ Fixed from 'nama_mobil' to 'nama'
  slug: string; // ✅ Added missing field
  merek_id: number;
  kategori_id: number;
  tahun_mulai: number; // ✅ Fixed from 'tahun_produksi' to 'tahun_mulai'
  tahun_akhir?: number | null; // ✅ Added missing field
  kapasitas_penumpang: number; // ✅ Added missing field
  tipe_bodi: string; // ✅ Added missing field
  status: string; // ✅ Added missing field
  deskripsi?: string; // ✅ Fixed formatting
  fitur_unggulan?: string; // ✅ Fixed from 'spesifikasi'
  merek?: Merek;
  kategori?: Kategori;
  stok_mobils?: StokMobil[];
  foto_mobils?: FotoMobil[];
  fotoMobils?: FotoMobil[]; // ✅ Laravel uses camelCase in relations
}

// StokMobil (Car Stock) interface - Fixed to match backend model
export interface StokMobil extends BaseModel {
  mobil_id: number;
  varian_id?: number;
  warna: string;
  no_rangka?: string; // ✅ Added missing field
  no_mesin?: string; // ✅ Added missing field
  no_polisi?: string; // ✅ Added no_polisi field
  tahun?: number;
  kilometer?: number;
  kondisi: "baru" | "bekas" | "sangat_baik"; // ✅ Added sangat_baik
  status: "tersedia" | "terjual" | "reserved";
  harga_jual: number;
  lokasi?: string;
  catatan?: string;
  kelengkapan?: string[];
  riwayat_perbaikan?: any[];
  foto_kondisi?: string[];
  foto_kondisi_urls?: string[]; // ✅ Added for photo URLs
  // ✅ Updated kondisi_fitur structure to match API
  kondisi_fitur?: {
    keamanan?: string[];
    kenyamanan?: string[];
    hiburan?: string[];
  };
  // ✅ Keep these for backward compatibility
  fitur_keamanan?: string[];
  fitur_kenyamanan?: string[];
  fitur_hiburan?: string[];
  // New fields for frontend display
  foto_url?: string;
  nama_lengkap?: string;
  // Relations
  mobil?: Mobil;
  varian?: Varian;
  riwayat_servis?: RiwayatServis[];
}

// FotoMobil (Car Photo) interface - Fixed to match backend model
export interface FotoMobil extends BaseModel {
  mobil_id: number;
  path_file: string; // ✅ Fixed from 'url_foto' to 'path_file'
  jenis_media?: string; // ✅ Added missing field from backend
  jenis_gambar?: string; // ✅ Added missing field from backend
  urutan_tampil?: number; // ✅ Added missing field from backend
  teks_alternatif?: string; // ✅ Added missing field from backend
  keterangan?: string; // ✅ Fixed from 'deskripsi' to 'keterangan'
  is_primary?: boolean; // ✅ Keep for frontend logic
  mobil?: Mobil;
}

// RiwayatServis (Service History) interface - Fixed to match backend model
export interface RiwayatServis extends BaseModel {
  stok_mobil_id: number;
  tanggal_servis: string;
  jenis_servis: string;
  tempat_servis?: string; // ✅ Fixed from 'bengkel' to 'tempat_servis'
  deskripsi?: string;
  biaya?: number;
  kilometer_servis?: number; // ✅ Added missing field
  foto_bukti?: string[]; // ✅ Added missing field (array)
  sparepart?: any[]; // ✅ Added missing field (array)
  // Relations
  stok_mobil?: StokMobil;
}

// JanjiTemu (Appointment) interface - Fixed to match backend model
export interface JanjiTemu {
  id: number;
  nama_pelanggan: string;
  email_pelanggan: string;
  telepon_pelanggan: string;
  alamat_pelanggan?: string;
  stok_mobil_id?: number; // Make this optional as per backend validation
  waktu_mulai: string;
  waktu_selesai?: string; // Optional as per backend
  waktu_alternatif?: string;
  jenis: "test_drive" | "konsultasi" | "negosiasi"; // ✅ Match backend validation exactly
  metode?: "online" | "offline";
  lokasi?: "showroom" | "rumah_pelanggan";
  tujuan?: string;
  pesan_tambahan?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  tanggal_request: string;
  created_at: string;
  updated_at: string;
}

// Varian (Car Variant) interface - Added to match backend model
export interface Varian extends BaseModel {
  mobil_id: number;
  nama: string;
  kode?: string;
  deskripsi?: string;
  harga_otr?: number;
  tipe_mesin?: string;
  kapasitas_mesin_cc?: number;
  silinder?: number;
  transmisi?: "manual" | "automatic";
  jumlah_gigi?: number;
  daya_hp?: number;
  torsi_nm?: number;
  jenis_bahan_bakar?: "bensin" | "diesel" | "listrik" | "hybrid";
  konsumsi_bahan_bakar_kota?: number;
  konsumsi_bahan_bakar_jalan?: number;
  panjang_mm?: number;
  lebar_mm?: number;
  tinggi_mm?: number;
  jarak_sumbu_roda_mm?: number;
  ground_clearance_mm?: number;
  berat_kosong_kg?: number;
  berat_isi_kg?: number;
  kapasitas_bagasi_l?: number;
  kapasitas_tangki_l?: number;
  akselerasi_0_100_kmh?: number;
  kecepatan_maksimal_kmh?: number;
  fitur_keamanan?: string[];
  fitur_kenyamanan?: string[];
  fitur_hiburan?: string[];
  aktif?: boolean;
  // Relations
  mobil?: Mobil;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Form types - Fixed to match API parameters
export interface CarSearchFilters {
  search?: string;
  merek_id?: number;
  kategori_id?: number;
  harga_min?: number;
  harga_max?: number;
  min_harga?: number;
  max_harga?: number;
  tahun_min?: number;
  tahun_max?: number;
  tahun_mulai?: number; // ✅ Added to match API
  tahun_akhir?: number; // ✅ Added to match API
  tahun_produksi?: number; // ✅ Keep for backward compatibility
  transmisi?: "manual" | "automatic";
  bahan_bakar?: "bensin" | "diesel" | "listrik" | "hybrid";
  kondisi?: "baru" | "bekas";
  sort?: string;
  page?: number;
}

export interface AppointmentForm {
  nama_pelanggan: string;
  email_pelanggan: string;
  telepon_pelanggan: string;
  alamat_pelanggan?: string;
  stok_mobil_id: number;
  waktu_mulai: string;
  waktu_selesai: string;
  jenis: "test_drive" | "konsultasi" | "negosiasi";
  tujuan?: string;
  pesan_tambahan?: string;
  waktu_alternatif?: string;
  metode: "online" | "offline";
  lokasi: "showroom" | "rumah_pelanggan";
}

export interface ContactForm {
  nama: string;
  email: string;
  telepon: string;
  subjek: string;
  pesan: string;
}
