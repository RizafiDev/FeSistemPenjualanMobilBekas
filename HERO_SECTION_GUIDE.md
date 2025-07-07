# Hero Section dengan Gambar Berubah Otomatis

## Overview

Hero section dengan fitur gambar yang berubah otomatis menggunakan data dari API endpoint `api/admin/homepages`. Gambar akan berubah dengan transisi fade setiap 5 detik.

## API Endpoint

- **URL**: `http://127.0.0.1:8000/api/admin/homepages`
- **Method**: GET
- **Authentication**: Bearer Token (API Key)
- **Response Format**: JSON

### Response Structure

```json
{
  "data": [
    {
      "id": 1,
      "pelanggan_puas": "50K+",
      "rating_puas": "98",
      "foto_homepage": [
        "http://127.0.0.1:8000/storage/homepage/image1.jpg",
        "http://127.0.0.1:8000/storage/homepage/image2.jpg",
        "http://127.0.0.1:8000/storage/homepage/image3.jpg"
      ],
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

## Komponen Frontend

### HeroSection Component

- **Location**: `aafrontend/src/components/hero-section.tsx`
- **Features**:
  - Auto-rotating images dengan interval 5 detik
  - Fade transition antar gambar
  - Image indicators (dots) untuk navigasi manual
  - Loading state saat mengambil data
  - Error handling untuk gambar yang gagal dimuat
  - Responsive design

### Hook Integration

- **Hook**: `useHomepage()` di `aafrontend/src/lib/hooks.ts`
- **Caching**: SWR dengan cache 1 jam
- **Revalidation**: Otomatis setiap jam

## Konfigurasi

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/admin
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_STORAGE_URL=http://127.0.0.1:8000/storage
```

### Backend Model (HomepageResource)

- **Model**: `app/Models/Homepage.php`
- **Resource**: `app/Filament/Resources/HomepageResource.php`
- **API Transformer**: `app/Filament/Resources/HomepageResource/Api/Transformers/HomepageTransformer.php`

## Fitur

### Auto-Rotate Images

- Interval: 5 detik
- Transisi: Fade (1 detik)
- Hanya aktif jika ada lebih dari 1 gambar

### Manual Navigation

- Dots indicator di bagian bawah gambar
- Click untuk navigasi langsung ke gambar tertentu

### Error Handling

- Fallback untuk gambar yang gagal dimuat
- Loading state dengan spinner
- Error state dengan pesan

### Performance Optimization

- Lazy loading untuk gambar setelah gambar pertama
- SWR caching untuk mengurangi API calls
- Image error tracking untuk skip gambar yang broken

## Penggunaan di Admin Panel

1. Login ke Filament Admin Panel
2. Navigasi ke "Homepage" resource
3. Create/Edit data homepage:
   - Upload multiple gambar untuk `foto_homepage`
   - Set `pelanggan_puas` (contoh: "50K+")
   - Set `rating_puas` (contoh: "98")
4. Gambar akan otomatis muncul di hero section website

## Customization

### Mengubah Interval Rotasi

```tsx
// Di HeroSection component, ubah nilai 5000 (5 detik)
const interval = setInterval(() => {
  setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
}, 3000); // 3 detik
```

### Mengubah Durasi Transisi

```tsx
// Ubah class transition-opacity
className={`absolute inset-0 transition-opacity duration-500 ${
  // Durasi 500ms
}`}
```

### Menambahkan Efek Transisi Lain

```css
/* Slide transition */
.slide-transition {
  transform: translateX(100%);
  transition: transform 1s ease-in-out;
}

.slide-transition.active {
  transform: translateX(0);
}
```

## Troubleshooting

### Gambar Tidak Muncul

1. Periksa API endpoint dapat diakses
2. Periksa API key valid
3. Periksa URL storage benar
4. Periksa data homepage exists di database

### Error Console

- Buka Developer Tools > Console
- Periksa error network atau JavaScript
- Periksa API response di Network tab

### Performance Issues

- Gunakan format gambar yang optimal (WebP, compressed JPEG)
- Sesuaikan ukuran gambar dengan display
- Implementasi CDN jika diperlukan
