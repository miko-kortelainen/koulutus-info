# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static website showing Finnish university joint-application (yhteishaku) applicant counts and degree listings. Data is fetched from two external APIs (Vipunen, Opintopolku), transformed into JSON, and committed as static files consumed by the frontend.

## Architecture

Two completely separate parts:

- **`backend/`** — Go CLI that fetches and transforms data into static JSON. Run with `go run . <vipunen|opintopolku|all>` from the `backend/` directory. Outputs to `frontend/public/data/`.
- **`frontend/`** — Vike (Vite + SSR framework) + React 19 + Chakra UI v3. Reads the committed JSON files at build time and at runtime via `fetch("/data/...")`.

There is no live backend API. The production deployment is a static `dist/client/` build served by nginx (via Docker) or GitHub Pages (CI deploys on push to `main`).

### Data flow

```
Opintopolku API → backend → frontend/public/data/schools.json
Vipunen API     → backend → frontend/public/data/statistics-<year>.json
                                       ↓
                          frontend fetches at runtime via TanStack Query
```

### Frontend routing (Vike filesystem routing)

Pages live under `frontend/src/pages/` as Vike file-based routes (`+Page.tsx`, `+Head.tsx`, `+config.ts`). Root `+config.ts` enables `prerender: true` — the build pre-renders all pages as static HTML.

### Type sharing (tygo)

Go model structs in `backend/models/` are the source of truth for JSON shape. `backend/tygo.yaml` configures [tygo](https://github.com/gzuidhof/tygo) to generate `frontend/src/types.gen.ts`. Run tygo after changing Go models to keep the TypeScript types in sync.

## Common commands

### Frontend

```sh
cd frontend
pnpm install       # install dependencies
pnpm dev           # dev server at http://localhost:5173
pnpm build         # SSG build → dist/
pnpm lint          # tsc type-check + eslint
pnpm preview       # preview the production build
```

### Backend (data generation)

```sh
cd backend
go run . vipunen       # regenerate statistics JSON for configured year
go run . opintopolku   # regenerate schools JSON
go run . all           # regenerate both
go test ./...          # run all Go tests
go test ./services/... # run a single package's tests
```

### Type generation

```sh
cd backend
tygo generate      # regenerate frontend/src/types.gen.ts from Go models
```

### Production container

```sh
docker compose up --build   # builds frontend and serves at http://localhost:8080
```

## Updating datasets

Edit `backend/config.json` before running data generation:
- `vipunen.aineistoUrl` + `vipunen.tilastoVuosi` — Vipunen statistics endpoint and target year
- `opintopolku.yhteishakuOid` — joint-application OID (preferred); fall back to `opintopolku.alkamisajankohdat` if OID is unavailable

See `docs/how_to_update.md` for the full step-by-step procedure.

## Deployment

CI (`website-deploy.yml`) builds `frontend/dist/client/` and deploys to GitHub Pages on every push to `main` that touches `frontend/` or the workflow file.
