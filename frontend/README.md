# Frontend

The frontend contains the website's pages, components and hooks. It uses React 19, TypeScript, Vike and Chakra UI. Vike prerenders the routes into a static site, which fetches the committed JSON files from `public/data/`.

### Requirements

- Node.js
- pnpm 11

### Quick start

```sh
pnpm install
pnpm run dev
```

Open `http://localhost:3000`.

### Commands

```sh
pnpm run dev        # Start the development server
pnpm run lint       # Run the score calculation tests, TypeScript and Biome
pnpm run build      # Generate the sitemap and build the static site
pnpm run preview    # Preview the production build
pnpm run test:unit  # Run the score calculation tests
pnpm run test:e2e   # Run the Playwright smoke tests
pnpm run format     # Format the src directory with Biome
```

The backend tools write the frontend datasets into `public/data/`. Tygo generates `src/types.gen.ts` and `src/types/pisterajat.gen.ts`, while the data generator updates `src/generated/dataManifest.ts`. Do not edit these files by hand.

See [`../backend/README.md`](../backend/README.md) for the data update commands.
