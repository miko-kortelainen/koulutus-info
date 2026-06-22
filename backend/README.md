# Data generator

The Go application fetches and prepares static frontend datasets from Vipunen and Opintopolku. It is an offline update tool, not a deployed server.

## Configuration

Edit `config.json` before generating data:

- `vipunen.aineistoUrl`: Vipunen dataset endpoint.
- `vipunen.tilastoVuosi`: historical statistics year.
- `opintopolku.yhteishakuOid`: preferred joint-application OID.
- `opintopolku.alkamisajankohdat`: fallback start terms used only when `yhteishakuOid` is empty.

The joint-application OID is updated manually. Automatic discovery from the Opintopolku website is intentionally deferred.

## Commands

Run commands from this directory:

```sh
go run . vipunen
go run . opintopolku
go run . all
```

The generator writes `statistics-<year>.json` and `schools.json` under `frontend/public/data/`. Statistics from existing years are left unchanged. Review and commit the generated files before deploying the frontend.

Generate frontend TypeScript types after changing exported data models:

```sh
tygo generate
```
