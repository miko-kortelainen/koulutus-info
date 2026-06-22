# Updating static data

The datasets are updated independently because Vipunen and Opintopolku publish changes on different schedules.

## Vipunen statistics

1. Set `vipunen.aineistoUrl` and `vipunen.tilastoVuosi` in `backend/config.json`.
2. Generate the statistics:

   ```sh
   cd backend
   go run . vipunen
   ```

3. Review and commit `frontend/public/data/statistics-<year>.json`. Existing years are left unchanged.

## Opintopolku schools

1. Set `opintopolku.yhteishakuOid` in `backend/config.json`.
2. If the OID is not available, leave it empty and set `opintopolku.alkamisajankohdat` as a fallback.
3. Generate the schools:

   ```sh
   cd backend
   go run . opintopolku
   ```

4. Review and commit `frontend/public/data/schools.json`.

The joint-application OID is currently found and configured manually. Automatic scraping from the Opintopolku website is outside the current implementation.

## Updating both datasets

After checking both source configurations:

```sh
cd backend
go run . all
```

Review the JSON diffs before committing them. A failed generation leaves the existing file unchanged.

## Deployment

Build the frontend-only production container after committing the generated files:

```sh
docker compose up --build
```
