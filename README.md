# SiteBook Project

Welcome to the **SiteBook** Expo application! This repository contains a React Native (Expo) app designed for managing laborers, cashbooks, attendance, and settlements.

Below is a highly detailed, deep dive into the project's architecture and folder structure, providing context on exactly what each folder and file is responsible for. This document is perfect for giving context to AI assistants or onboarding new developers.

---

## 📁 Deep Project Structure

```text
src/
├── global.css                          # Global CSS configurations (if using NativeWind or Tailwind)
├── app/                                # 🟢 EXPO ROUTER: Main application pages and navigation
│   ├── _layout.tsx                     # Root layout, wraps the app in Theme & Database providers
│   ├── index.tsx                       # Redirects or acts as the entry landing page
│   ├── home.tsx                        # The main dashboard/overview screen
│   ├── cashbook.tsx                    # Cashbook tab: lists transactions (cash-in/cash-out)
│   ├── notifications.tsx               # Notifications screen
│   ├── reports.tsx                     # Reports and analytics screen
│   ├── settings.tsx                    # Settings screen (theme, language, etc.)
│   ├── Assets/                         
│   │   └── turn-back.png               # Local asset used in routing or headers
│   └── labor/                          # 🧑‍🏭 Labor-specific route group
│       ├── index.tsx                   # Lists all laborers
│       ├── add.tsx                     # Screen to add a new laborer
│       ├── labor-data.ts               # Helper functions/data for labor routing logic
│       └── [id]/                       # Dynamic route for a specific laborer (e.g. /labor/rajesh-kumar)
│           ├── mainCashbook.tsx        # The detailed ledger/attendance view for ONE specific laborer
│           └── profile.tsx             # The editable profile screen for ONE specific laborer
│
├── backend/                            # ☁️ BACKEND: Supabase configurations and server integrations
│   ├── client.ts                       # Initializes the Supabase client (using URL & Anon Key from .env)
│   ├── schema.sql                      # SQL file containing the Supabase database schema and RLS policies
│   └── services/                       
│       └── auth.ts                     # Auth service layer (Sign up, login, logout wrappers)
│
├── components/                         # 🧩 REUSABLE UI COMPONENTS
│   ├── app-backdrop.tsx                # Visual backdrop component (e.g., for modals)
│   ├── app-theme.tsx                   # React Context provider for handling Light/Dark mode
│   ├── external-link.tsx               # Component for safely opening external URLs
│   ├── hint-row.tsx                    # Reusable row for displaying hints or minor info
│   ├── themed-text.tsx                 # Text component that automatically adapts to the current theme
│   ├── themed-view.tsx                 # View component that automatically adapts to the current theme
│   ├── web-badge.tsx                   # Badge component specific to web rendering
│   ├── bars/                           # Navigation bar components
│   │   ├── app-bottom-bar.tsx          # The persistent bottom tab navigation bar
│   │   └── app-header.tsx              # Reusable top header component
│   └── ui/                             
│       └── collapsible.tsx             # Standard collapsible/accordion UI component
│
├── constants/                          # 🎨 CONSTANTS
│   └── theme.ts                        # Defines the exact hex codes for light and dark color palettes
│
├── database/                           # 💾 LOCAL DATA LAYER (Transitioning to Supabase)
│   ├── index.ts                        # Main export barrel file for the database layer
│   ├── types.ts                        # TypeScript interfaces for Laborers, Cashbook rows, Profiles, etc.
│   ├── app-database.ts                 # Instantiates the different repositories (labor, cashbook, etc.)
│   ├── demo-database.ts                # Large file containing mock/dummy data for testing the UI
│   ├── helpers.ts                      # Utility functions for data formatting (e.g., currency, slugs)
│   ├── hooks.ts                        # React Hooks (useLaborers, useLaborProfile) used by components
│   ├── store.ts                        # Base observable store class for managing local state reactivity
│   ├── labor-repository.ts             # Logic for managing labor data (create, update, mark present)
│   ├── cashbook-repository.ts          # Logic for managing global cashbook transactions
│   ├── notification-repository.ts      # Logic for managing notification state
│   ├── settings-repository.ts          # Logic for managing user preferences
│   └── selectors.ts                    # Functions to compute derived data (like totals for the dashboard)
│
└── hooks/                              # 🪝 GENERIC REACT HOOKS
    ├── use-theme.ts                    # Hook to access the current theme context
    ├── use-color-scheme.ts             # Native hook for detecting system color scheme
    └── use-color-scheme.web.ts         # Web-specific hook for detecting system color scheme
```

---

## 🏗 Architectural Context

### 1. Routing (`src/app`)
This project uses **Expo Router** (file-based routing). 
- Top-level files (`home.tsx`, `cashbook.tsx`) represent the main tabs of the application.
- The `src/app/labor/[id]` folder is a dynamic route. When navigating to `/labor/rajesh-kumar/mainCashbook`, Expo Router maps `rajesh-kumar` to the `[id]` parameter and renders `mainCashbook.tsx`.

### 2. Theming (`src/components/app-theme.tsx` & `src/constants/theme.ts`)
The app has a strict, custom Light and Dark mode implementation. It does **not** rely purely on default React Native styles. Instead, components read colors from the `useAppTheme()` hook (which references `src/constants/theme.ts`). 

### 3. Data & State Management (`src/database`)
Originally built with an observable, local-first mock database (`labor-repository.ts`, `demo-database.ts`), the app is currently in a transition phase.
- Components use hooks like `useLaborers()` from `src/database/hooks.ts`.
- These hooks are being actively migrated to fetch data from the **Supabase Backend** asynchronously, but they fall back to the dummy data to prevent the UI from breaking.

### 4. Backend integration (`src/backend`)
Supabase is the chosen backend.
- `client.ts` sets up the Supabase instance using `@react-native-async-storage/async-storage` for session persistence.
- `schema.sql` contains the table definitions (`profiles`, `laborers`) and Row Level Security (RLS) policies needed in the Supabase cloud dashboard.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Environment Variables**
   Rename `.env.example` to `.env` and provide your Supabase URL and Anon Key.
3. **Start the App**
   ```bash
   npm start
   ```
