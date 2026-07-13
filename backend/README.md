# Data generator

The Go application fetches and prepares static frontend datasets from Vipunen and Opintopolku. It is an offline update tool.

## Configuration

`config.json` holds the default data year and the current manually sourced joint-application OID:

- `vipunen.aineistoUrl`: Vipunen dataset endpoint.
- `vipunen.tilastoVuosi`: historical statistics year.
- `opintopolku.yhteishakuOid`: preferred joint-application OID.
- `opintopolku.alkamisajankohdat`: fallback start terms used only when `yhteishakuOid` is empty.

The joint-application OID is updated manually. Opintopolku does not expose a suitable endpoint for discovering the correct OID automatically.

## Commands

Run commands from this directory:

```sh
go run . --statistics
go run . --programmes
go run . --statistics --programmes
```

Select a statistics year without changing configuration:

```sh
go run . --year 2027 --statistics
```

For programmes for a different year, provide the manually sourced OID explicitly:

```sh
go run . --year 2027 --programmes --yhteishaku-oid 1.2.246.562.29.00000000000000000000
```

The generator writes `statistics-<year>.json`, `schools.json`, and `meta.json` under `frontend/public/data/`. `meta.json` is the data manifest: it records available statistics years, the latest year, source-specific refresh dates, and the programme selection OID. It also updates `frontend/src/generated/dataManifest.ts`, which keeps the frontend year selector in sync. Existing `vipunen`, `opintopolku`, and `all` commands remain supported.

Before replacing an existing dataset, the generator rejects a result with less than half of the previous record count. Review the generated files before deploying the frontend.

Generate frontend TypeScript types after changing exported data models:

```sh
tygo generate
```

## Converting admission cutoffs

`pisterajat.csv` is converted separately because it is a manually supplied CSV,
not part of the Vipunen or Opintopolku refresh.

```sh
go run ./cmd/pisterajat
```

By default this reads `pisterajat.csv` and writes
`frontend/public/data/pisterajat.json`. Set either path explicitly, or write
JSON to standard output with `--output -`:

```sh
go run ./cmd/pisterajat --input path/to/pisterajat.csv --output path/to/pisterajat.json
go run ./cmd/pisterajat --output -
```

The JSON preserves the CSV's order and groups each row as:

```json
[
  {
    "name": "Aalto-yliopisto",
    "programmes": [
      {
        "name": "Automaatio ja robotiikka, tekniikan kandidaatti ja diplomi-insinööri (3 v + 2 v) - DIA-valintayhteistyö",
        "koulutusala": "Tekniikan alat",
        "cutoffs": [
          {
            "selectionMethod": "Todistusvalinta ensikertalaisille hakijoille",
            "score": 145.2
          }
        ]
      }
    ]
  }
]
```

The CSV header must be `Koulu;Ohjelma;Valintatapa;Pisteraja;Koulutusala`.
`Pisteraja` is parsed as a JSON number, accepting the Finnish decimal comma.
