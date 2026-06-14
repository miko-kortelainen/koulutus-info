# Frontend

A React SPA built with Vite that displays school data and statistics from the backend.

## Quick Start

```sh
# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

## Tech Stack

- **Core:** React 19, Vite, pnpm
- **Styling:** Chakra UI
- **Routing:** React Router (`src/App.tsx`)
- **Data:** Native `fetch` + TanStack Query
- **Types:** Auto-generated from backend (`src/types.gen.ts` — do not edit manually)

## Architecture

The app uses a **Feature-Based Architecture**. Code is grouped by domain rather than file type.

```text
src/
├── features/    # Domain-specific pages and logic (e.g. schools/, stats/)
├── components/  # Shared, reusable UI building blocks
├── layout/      # Global layout wrappers (e.g. Navbars)
├── api/         # Functions to communicate with the backend
├── types.gen.ts # Auto-generated backend types
└── App.tsx      # Main router
```
