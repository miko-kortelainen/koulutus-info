<div align="center">
<img src="./docs/banner.png" alt="yhteishaku.app banner">
</div>

### Tietoa projektista

Yhteishaku.app auttaa tutustumaan korkeakoulujen ja lukioiden yhteishaun tilastoihin. Sivusto sisältää:

- Hakijamäärät ja hakijaprofiilit
- Valintojen pisterajat sekä ylioppilaskokeiden pisterajat
- Lukioiden sisäänpääsyn keskiarvorajat
- Koulutusohjelmat
- Trendit ja koulutustarve-ennusteet
- Opiskelijapalautteen
- Todistusvalinnan pistelaskurin

### Kehitystyökalut

- TypeScript
- React
- Vike staattisen sivuston esirenderöintiin
- _pnpm_-paketinhallinta
- Playwright end-to-end-savutesteihin
- Go tilasto-, koulutusohjelma- ja pisterajadatan muuntamiseen frontendin aineistoiksi

### Projektin rakenne

- `/datagen` sisältää paikallisen Go-komentorivityökalun datan ja tyyppien generointiin sekä siivoamiseen.
- `/frontend` sisältää verkkosivuston sivut, komponentit ja hookit.

### Paikallinen kehitys

Asenna Node.js ja pnpm 11, ja aja sen jälkeen:

```sh
cd frontend
pnpm install
pnpm run dev
```

Avaa selaimessa `http://localhost:3000`.

Kaikki komennot löytyy [frontendin README-tiedostosta](./frontend/README.md).

### Testit

Aja datageneraattorin testit `/datagen`-hakemistossa:

```sh
go test ./...
```

Aja frontendin tarkistukset `/frontend`-hakemistossa:

```sh
pnpm run lint
pnpm run test:component
pnpm run test:e2e
```

### Käytetyt tietolähteet

- [Opintopolku.fi](https://opintopolku.fi)
- [Vipunen](https://vipunen.fi)
