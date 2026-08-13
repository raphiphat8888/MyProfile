# Frontend - MyProfile Expo Application

This is the frontend React Native/Expo application for MyProfile.

## Tech Stack

- **Framework**: Expo (v54.0.34)
- **Navigation**: Expo Router
- **Language**: TypeScript
- **UI**: React Native
- **State Management**: React Context API

## Project Structure

```
frontend/
├── app/                    # Expo Router pages and layouts
│   ├── (admin)/           # Admin-only screens
│   ├── (tabs)/            # Main tab navigation
│   ├── product/           # Product detail pages
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── common/           # Shared components
│   ├── home/             # Home page components
│   ├── product/          # Product-related components
│   ├── profile/          # Profile components
│   └── ui/               # Basic UI elements
├── contexts/             # React Context providers
│   ├── auth-context.ts
│   ├── cart-context.ts
│   ├── products-context.ts
│   └── profile-context.ts
├── hooks/                # Custom React hooks
│   ├── use-auth.ts
│   ├── use-cart.ts
│   ├── use-products.ts
│   └── use-profile.ts
├── services/             # API service layer
│   ├── auth-api.ts
│   ├── orders-api.ts
│   ├── products-api.ts
│   └── profile-api.ts
├── providers/            # Provider components
│   ├── AuthProvider.tsx
│   ├── CartProvider.tsx
│   ├── ProductsProvider.tsx
│   └── ProfileProvider.tsx
├── constants/            # App constants and configurations
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── assets/               # Images, fonts, and static assets
├── public/              # Public static files
└── dist/                 # Build output directory
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### Development

Start the development server:

```bash
npm start
```

Run on specific platforms:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Build

```bash
# Lint code
npm run lint

# Reset project
npm run reset-project
```

## API Integration

The frontend connects to the backend API through the services in the `services/` directory. The API base URL is configured in `services/products-api.ts`.

## Features

- **Authentication**: Login/logout with JWT tokens
- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add items and manage quantities
- **Admin Panel**: Manage inventory, orders, and account settings
- **Profile Management**: User profile and settings
- **Export**: Export product data to CSV/JSON

## Key Components

- **AuthProvider**: Manages authentication state
- **ProductsProvider**: Manages product data and caching
- **CartProvider**: Manages shopping cart state
- **ProfileProvider**: Manages user profile data

## Navigation

The app uses Expo Router with file-based routing:
- Tab navigation for main screens
- Modal presentation for cart
- Stack navigation for admin and product details
