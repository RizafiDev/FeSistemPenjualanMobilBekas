# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js 14+ frontend application for a used car sales system with the following characteristics:

-   **Framework**: Next.js 14+ with App Router
-   **Styling**: Tailwind CSS v4
-   **Components**: ShadCN UI components
-   **Forms**: React Hook Form with Zod validation
-   **Data Fetching**: SWR for API calls
-   **SEO**: next-seo for optimization
-   **Backend**: Laravel 12 REST API with Filament API Service

## Architecture Guidelines

### API Integration

-   Base API URL: `http://127.0.0.1:8000/api/admin/`
-   All API calls should be made through SWR for caching and optimization
-   Use TypeScript interfaces for all API responses
-   Handle loading states and error cases gracefully

### Component Structure

-   Use ShadCN UI components for all UI elements
-   Follow atomic design principles: atoms, molecules, organisms
-   Create reusable components in `/components` folder
-   Use proper TypeScript typing for all props

### SEO & Performance

-   Implement proper meta tags for each page
-   Use Next.js Image component for optimized images
-   Implement lazy loading for car galleries
-   Generate proper JSON-LD structured data for cars

### Styling Guidelines

-   Use Tailwind CSS utilities with proper responsive design
-   Follow mobile-first approach
-   Use CSS Grid and Flexbox for layouts
-   Implement proper hover and focus states

### Form Validation

-   Use React Hook Form with Zod schemas
-   Provide clear error messages
-   Implement proper form submission states
-   Use ShadCN Form components

### Code Quality

-   Use TypeScript strictly (no `any` types)
-   Implement proper error boundaries
-   Use meaningful component and variable names
-   Add JSDoc comments for complex functions
-   Follow Next.js 14+ best practices

## API Endpoints

Based on the Laravel backend:

-   `GET /api/admin/foto-mobils` - Car photos
-   `GET /api/admin/janji-temus` - Appointments
-   `POST /api/admin/janji-temus` - Create appointment
-   `GET /api/admin/kategoris` - Categories
-   `GET /api/admin/mereks` - Brands
-   `GET /api/admin/mobils` - Cars
-   `GET /api/admin/riwayat-servis` - Service history
-   `GET /api/admin/stok-mobils` - Car stock

## Pages Structure

-   Landing page with hero section and car search
-   Catalog page with filters and pagination
-   Car detail pages with galleries and specifications
-   Brand pages with brand information and cars
-   Category pages with category filters
-   Appointment booking form
-   Contact page

Remember to always prioritize user experience, accessibility, and performance optimization.
