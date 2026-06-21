# Frontend

A React SPA built with Vite that displays the committed datasets in `public/data/`.

## Quick start

```sh
pnpm install
pnpm dev
```

## Production

The multi-stage Docker image builds the Vite application and serves it with nginx. Build it from the repository root with:

```sh
docker compose up --build
```

## Tech stack

- React 19 and Vite
- Chakra UI
- React Router
- Native `fetch` and TanStack Query
- Types generated from the Go output models in `src/types.gen.ts`
