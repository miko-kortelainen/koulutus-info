# Backend

A Go REST API that fetches and transforms data from Opintopolku and Vipunen for the frontend.

## Quick Start

```sh
# Start the server (runs on localhost:8080)
go run main.go

# Generate frontend TypeScript types from Go structs
tygo generate
```

## Endpoints

- `GET /api/schools`
- `GET /api/statistics`

## Architecture

Flow: `Router (main.go) -> Handlers (handlers/) -> Business Logic (services/)`

- `main.go` - Application entry point and router.
- `handlers/` - API route definitions and request/response parsing.
- `services/` - 3rd party API calls, data transformation, caching.
- `models/` - Data structures (used by Tygo to generate frontend types).
- `docs/` - In-depth documentation.
