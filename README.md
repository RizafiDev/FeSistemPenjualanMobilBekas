# Sistem Penjualan Mobil Bekas - Frontend

Modern Next.js 14+ frontend application untuk sistem penjualan mobil bekas yang terintegrasi dengan Laravel 12 backend REST API.

## 🚀 Tech Stack

-   **Framework**: Next.js 14+ dengan App Router
-   **Styling**: Tailwind CSS v4
-   **Components**: ShadCN UI
-   **Forms**: React Hook Form dengan Zod validation
-   **Data Fetching**: SWR untuk API calls dan caching
-   **SEO**: next-seo untuk optimasi SEO
-   **TypeScript**: Full TypeScript support
-   **Icons**: Lucide React icons

## 🏗️ Architecture

### Frontend Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── mobil/             # Car catalog & detail pages
│   ├── janji-temu/        # Appointment booking
│   ├── kontak/            # Contact page
│   └── sitemap.ts         # Dynamic sitemap
├── components/            # Reusable components
│   ├── ui/                # ShadCN UI components
│   ├── layout/            # Layout components
│   ├── car/               # Car-related components
│   ├── catalog/           # Catalog components
│   ├── appointment/       # Appointment components
│   └── contact/           # Contact components
└── lib/                   # Utilities
    ├── api.ts             # API configuration
    ├── hooks.ts           # SWR custom hooks
    ├── types.ts           # TypeScript types
    ├── utils.ts           # Utility functions
    ├── seo.ts             # SEO configurations
    └── validations.ts     # Zod schemas
```

### Backend Integration

-   **Base API URL**: `http://127.0.0.1:8000/api/admin/`
-   **API Endpoints**:
    -   `/mobils` - Cars data
    -   `/mereks` - Car brands
    -   `/kategoris` - Categories
    -   `/stok-mobils` - Car stock/variants
    -   `/foto-mobils` - Car photos
    -   `/janji-temus` - Appointments
    -   `/riwayat-servis` - Service history

## 🎯 Features

### Landing Page

-   Hero section dengan form pencarian
-   Featured cars carousel
-   Brand showcase
-   Company features & testimonials
-   Call-to-action sections

### Catalog Page

-   Advanced search & filtering
-   Dynamic pagination
-   Sort options (price, year, newest)
-   Filter by brand, category, price range, transmission, fuel type
-   Responsive grid layout
-   Loading states & error handling

### Car Detail Page

-   Image gallery dengan lightbox
-   Car specifications & variants
-   Price information & availability
-   Service history
-   Appointment booking integration
-   Social sharing functionality

### Appointment System

-   Multi-step form with validation
-   Car selection from catalog
-   Date/time picker
-   Service type selection (test drive, consultation, negotiation)
-   Meeting method (online/offline)
-   Location preferences
-   Real-time availability checking

### Contact Page

-   Contact form dengan validation
-   Company information
-   Business hours
-   Location map integration ready
-   Social media links
-   WhatsApp integration

## 🔧 Setup & Installation

### Prerequisites

-   Node.js 18+
-   npm atau yarn
-   Laravel backend running pada port 8000

### Installation Steps

1. **Clone repository**

    ```bash
    cd c:\laragon\www\SistemPenjualanMobilBekas\aafrontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Setup environment**

    ```bash
    cp .env.example .env.local
    ```

    Update API base URL jika berbeda dari default.

4. **Run development server**

    ```bash
    npm run dev
    ```

5. **Open browser**
   Navigate to `http://localhost:3000`

### Build & Deploy

```bash
# Build untuk production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎨 Design System

### Color Palette

-   Primary: Blue variants untuk call-to-action
-   Secondary: Gray variants untuk content
-   Success: Green untuk confirmations
-   Warning: Yellow untuk alerts
-   Error: Red untuk errors

### Typography

-   Headings: Font weight 600-800
-   Body: Font weight 400-500
-   Small text: Font weight 400

### Components

Menggunakan ShadCN UI dengan customizations:

-   Buttons dengan variants (default, outline, ghost)
-   Cards untuk content containers
-   Forms dengan validation states
-   Dialogs untuk modals
-   Navigation dengan dropdown menus

## 📱 Responsive Design

-   **Mobile First**: Dimulai dari mobile kemudian scale up
-   **Breakpoints**:
    -   sm: 640px
    -   md: 768px
    -   lg: 1024px
    -   xl: 1280px
    -   2xl: 1536px

## 🔍 SEO Features

-   **Meta Tags**: Dynamic title, description, keywords
-   **Open Graph**: Social media sharing optimization
-   **Twitter Cards**: Twitter-specific meta tags
-   **Structured Data**: JSON-LD untuk cars dan business
-   **Sitemap**: Dynamic sitemap generation
-   **Robots.txt**: Search engine crawling rules
-   **Canonical URLs**: Duplicate content prevention

## 🚀 Performance

-   **Image Optimization**: Next.js Image component
-   **Code Splitting**: Automatic dengan App Router
-   **Lazy Loading**: Images dan components
-   **Caching**: SWR untuk API responses
-   **Bundle Optimization**: Tree shaking dan minification

## 🧪 Development Guidelines

### Code Quality

-   TypeScript strict mode
-   ESLint dengan Next.js rules
-   Prettier untuk code formatting
-   Meaningful naming conventions
-   JSDoc comments untuk complex functions

### Component Structure

-   Atomic design principles
-   Reusable components
-   Proper TypeScript typing
-   Error boundaries
-   Loading states

### API Integration

-   SWR untuk data fetching
-   Error handling
-   Loading states
-   Optimistic updates
-   Caching strategies

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build untuk production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Project ini menggunakan MIT License - lihat [LICENSE](LICENSE) file untuk details.

## 🔗 Links

-   **Backend Repository**: Laravel 12 REST API
-   **Live Demo**: Coming soon
-   **Documentation**: Project documentation

## 📞 Support

Untuk pertanyaan atau dukungan, hubungi:

-   Email: developer@tokojayamotor.com
-   WhatsApp: +62 812-3456-7890

---

Dikembangkan dengan ❤️ menggunakan Next.js 14+ dan modern web technologies.
