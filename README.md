# koulutus-info

Selaa korkeakoulujen yhteishaun hakijoiden ja aloituspaikkojen määriä sekä koulutustarjontaa helppokäyttöisessä ja visuaalisesti miellyttävässä käyttöliittymässä.

## Prerequisites

- [Go](https://go.dev/) 1.26+ for updating data
- [Node.js](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/) 11+ for frontend development
- [Docker](https://www.docker.com/) for the production container

## Local development

The committed files under `frontend/public/data/` are available through the Vite development server.

```sh
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

See [docs/how_to_update.md](docs/how_to_update.md) before updating either dataset.

## Production container

```sh
docker compose up --build
```

Open `http://localhost:8080`. The container includes only nginx, the frontend build, and the generated JSON files.

## Data sources

- [Opintopolku](https://opintopolku.fi)
- [Vipunen](https://vipunen.fi)
