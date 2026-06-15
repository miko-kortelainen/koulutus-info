# koulutus-info

selaa korkeakoulujen yhteishaun hakijoiden ja aloituspaikkojen määriä sekä koulutustarjontaa helppokäyttöisessä ja visuaalisesti miellyttävässä käyttöliittymässä.

## Usage

### Prerequisites

- [Go](https://go.dev/) 1.26+
- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 11+
- [Docker](https://www.docker.com/)

### Local development

**Backend:**

```sh
cd backend
go run main.go
```

Backend starts to URL: `http://localhost:8080`.

**Frontend:**

```sh
cd frontend
pnpm install
pnpm dev
```

Frontend starts to URL `http://localhost:5173`.

### With Docker

Start the whole stack with one command:

```sh
docker compose up --build
```

## 3rd party APIs used

- **[Opintopolku](https://opintopolku.fi)**
- **[Vipunen](https://vipunen.fi)**

## Development methodology

This project was **NOT** vibecoded, AI was used strictly as a tool to be more efficient, reduce repetetive typing, speed up documentation writing, and boilerplate code generation. I mainly used GitHub Copilot and Antigravity CLI.
