# Data generator

The Go application fetches and prepares static frontend datasets from Vipunen and Opintopolku. It is an offline update tool.

## Configuration

`config.json` holds the programme start year used for Vipunen statistics and the current manually sourced joint-application haut:

- `vipunen.aineistoUrl`: Vipunen dataset endpoint.
- `vipunen.tilastoVuosi`: programme start year. The generator fetches both start seasons for this year.
- `vipunen.hakutapa`: application method included in the statistics, normally `Yhteishaku`.
- `opintopolku.haut`: current joint-application waves. Each entry has `id` (`YYYY_kevat_N` or `YYYY_syksy`) and `oid`. The first entry is the default `/koulutukset` wave.
- `opintopolku.alkamisajankohdat`: fallback start terms used only when a haku has an empty OID.

Joint-application OIDs are updated manually. Opintopolku does not expose a suitable endpoint for discovering the correct OID automatically.

## Commands

Run commands from this directory:

```sh
go run . --statistics
go run . --programmes
go run . --statistics --programmes
```

Select a programme start year without changing configuration:

```sh
go run . --year 2027 --statistics
```

Refresh one configured wave:

```sh
go run . --programmes --yhteishaku-oid 1.2.246.562.29.00000000000000092075
```

The generator writes one statistics file per joint application under `frontend/public/data/hakijamäärät/`. An autumn 2026 programme start is written to `hakijamaarat-2026-kevat.json`, and a spring 2026 programme start is written to `hakijamaarat-2025-syksy.json`. It also writes one `current_programs-<round>.json` file per configured haku, regenerates `schools.json` (institution catalog from all programme files ∪ all statistics rounds), and `meta.json`. `meta.json` records the available and current statistics rounds, source-specific refresh dates, and the programme haut. The generated `frontend/src/generated/dataManifest.ts` keeps the frontend joint-application selectors in sync. Existing `vipunen`, `opintopolku`, `catalog`, and `all` commands remain supported.

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

By default this reads `pisterajat.csv` and writes one JSON file per `Yhteishaku`
under `frontend/public/data/`, for example `pisterajat-2026-kevat.json` and
`pisterajat-2026-syksy.json`. Set the input path or output directory explicitly:

```sh
go run ./cmd/pisterajat --input path/to/pisterajat.csv --output-dir path/to/data
```

The lukio averages at
`frontend/public/data/pisterajat/lukio/lukio-keskiarvot-2026.json` are a separate manual import. This command does not
generate them.

The JSON preserves the CSV's order and groups each row as:

```json
[
  {
    "name": "Hämeen ammattikorkeakoulu",
    "sector": "Ammattikorkeakoulukoulutus",
    "programmes": [
      {
        "name": "Artenomi (AMK), älykäs ja kestävä muotoilu, päivätoteutus, kevään yhteishaku",
        "koulutusala": "Humanistiset ja taidealat",
        "cutoffs": [
          {
            "selectionMethod": "Älykkään ja kestävän muotoilun koe",
            "score": 51,
            "startYear": 2026,
            "startSeason": "Syksy"
          }
        ]
      }
    ]
  }
]
```

The CSV header must be
`yhteishaku;alkamisvuosi;alkamisaika;sektori;ylempi/alempi;ala;ala2;koulu;valintatapa;ohjelma;pisteet_alin;pisteet_ylin`.
`yhteishaku` uses the format `2026, kevät`. `pisteet_alin` is parsed as the JSON cutoff score, accepting the
Finnish decimal comma. The current JSON contract does not include `ylempi/alempi`, `ala2`, or `pisteet_ylin`.
