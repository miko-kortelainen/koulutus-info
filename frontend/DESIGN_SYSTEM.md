# Design System (`frontend/`)

Tämä dokumentti on `yhteishaku.app`-käyttöliittymän sääntökirja. Sen tarkoitus on pitää kaikki sivut visuaalisesti ja rakenteellisesti yhtenäisinä, jotta uusia näkymiä tai komponentteja tehdessä ei tarvitse arpoa välistyksiä (`gap`, `padding`), fonttikokoja, väritokeneita tai kontrollien toteutustapaa.

Kaikki tyylit rakennetaan Chakra UI v3 -komponenteilla ja [src/theme.ts](src/theme.ts) -teeman semanttisilla tokeneilla.

---

## 1. Sivurakenne ja sivupohjat

### 1.1 Vakiorunko (`PageIntro` + `PageContainer`)

Jokainen sivu koostuu `PageIntro`-yläosiosta ja `PageContainer align="flex-start"` -sisältöalueesta:

```tsx
<>
  <PageIntro
    description="Lyhyt, selkeä kuvaus sivun tarkoituksesta."
    title="Sivun otsikko"
  />
  <PageContainer align="flex-start">
    {/* Sivun sisältö */}
  </PageContainer>
</>
```

- **`PageIntro` sisältää sivun ainoan `h1`-otsikon.** Sivun sisällössä osiot alkavat aina `h2`-tasolta.
- **Poikkeukset, joilla ei ole `PageIntro`-komponenttia:**
  1. Etusivu `/` ([src/pages/index/+Page.tsx](src/pages/index/+Page.tsx)) – käyttää koko näkymän Hero-osiota.
  2. Virhesivu (`404` / virhe, [src/pages/_error/+Page.tsx](src/pages/_error/+Page.tsx)) – keskitetty tilanäkymä.
  3. Yksittäiset opas-artikkelit `/oppaat/<slug>/` ([src/pages/oppaat/components/GuideLayout.tsx](src/pages/oppaat/components/GuideLayout.tsx)) – kapea (`42rem`) lukuleveys, päivämäärä ja TL;DR-nosto.
- Kaikilla muilla sivuilla — mukaan lukien tukisivut (`/oppaat/`, `/ukk/`, `/palaute/`, `/asenna/`, `/tietosuojaseloste/`) ja dynaamiset alasivut (`/koulut/@slug/`, `/koulut/@slug/pisterajat/`, `/koulut/@slug/opiskelijapalautteet/`, `/pisterajat/@ala/`, `/lukiot/@slug/`, `/lukiot/kaupungit/@kunta/`) — käytetään `PageIntro`-komponenttia.

### 1.2 Alasivujen paluulinkki (`BackLink`)

Kun käyttäjä on hierarkkisella alasivulla (esim. `/koulut/@slug/`, `/koulut/@slug/pisterajat/`, `/koulut/@slug/opiskelijapalautteet/`, `/pisterajat/@ala/`, `/lukiot/@slug/`, `/lukiot/kaupungit/@kunta/`):
- Sijoita `<BackLink href="..." />` ([src/components/BackLink.tsx](src/components/BackLink.tsx)) ensimmäiseksi elementiksi `PageContainer`in sisälle.

### 1.3 Sivutyypit (3 arkkityyppiä)

Valitse sivulle jokin näistä kolmesta asettelusta sen sijaan, että keksit uuden sijoittelun:

#### Tyyppi A: Sivupalkki + tuloslista (monisuodatinhaku)
Käyttökohteet: `/koulutukset/`, `/hakijamaarat/`.

```tsx
<Stack align="start" direction={{ base: "column", md: "row" }} gap={6} width="full">
  {/* Sivupalkki */}
  <Stack gap={4} position={{ md: "sticky" }} width={{ base: "100%", md: "72" }}>
    {/* Haku, kierrosvalinta ja Accordion.Root multiple size="sm" (FilterItem) */}
  </Stack>

  {/* Tulosalue */}
  <Stack flex={1} gap={4} minW={0} width="100%">
    {/* Mahdolliset järjestys-/vuosivalitsimet, tuloslaskuri, korttilista ja Pagination */}
  </Stack>
</Stack>
```

#### Tyyppi B: Yläsuodattimet + tuloslista, haitari tai taulukko
Käyttökohteet: `/lukiot/`, `/lukiot/kaupungit/`, `/koulut/`, `/koulut/@slug/pisterajat/`, `/yo-pisterajat/`, `/ennakointi/`, `/pistelaskuri/` (tulososio).

- Suodatinrivi sijoitetaan tuloslistan yläpuolelle:
  - Vierekkäiset kentät (`md`+): `<Stack direction={{ base: "column", md: "row" }} gap={6} width="full">`
  - Allekkaiset kentät tai yhdistetty suodatinlohko: `<Stack gap={4} width="full">`
- Suodattimien alla esitetään tuloslaskuri (jos relevantti), tulokset (`gap={4}` korteille, `gap={3}` haitareille) ja `<Pagination />`.

#### Tyyppi C: Sisältö-, hakemisto- ja työkalusivut
Käyttökohteet: `/pisterajat/`, `/oppaat/`, `/ukk/`, `/palaute/`, `/tietosuojaseloste/`, `/asenna/`, `/oma-hakulista/`, `/vertaile/`, `/hakijalle/`, `/opolle/`.

- Sisältö rakentuu suoraan `PageContainer`in sisään.
- Loogiset pääosiot ryhmitellään `<Stack as="section" gap={4} width="full">` (tai tiiviissä tekstikappaleissa `gap={2}`), joiden sisällä on `<Heading as="h2" size="md">`.

---

## 2. Spacing- ja mitoitussäännöt

Älä käytä satunnaisia `mt`/`mb`-marginaaleja sisaruselementtien välillä, vaan hallitse välit ensisijaisesti vanhemman `Stack`-, `Flex`- tai `SimpleGrid`-komponentin `gap`-ominaisuudella.

| Konteksti | Chakra-arvo | Pikseleinä / rem | Sääntö |
| --- | --- | --- | --- |
| **Sivun maksimileveys** | `width={{ base: "100%", md: "60rem" }}` | `960px` | Hoidetaan `PageIntro`- ja `PageContainer`-komponenteissa. |
| **Sivun reunatäyte** | `px={{ base: 4, md: 6 }}` | `16px` / `24px` | Hoidetaan `PageIntro`- ja `PageContainer`-komponenteissa. |
| **`PageIntro` alaväli** | `mb={{ base: 6, md: 10 }}` | `24px` / `40px` | Hoidetaan `PageIntro`-komponentissa. |
| **Sivun perussisältöväli** | `gap={4}` | `1rem` (`16px`) | `PageContainer`in oletusväli lapsielementtien välillä. |
| **Suurten osioiden väli** | `gap={6}` tai `gap={8}` | `24px` / `32px` | Kun erotetaan toisistaan erillisiä isoja sivulohkoja (esim. lomake ja tulokset). |
| **Vierekkäiset syötekentät** | **`gap={6}`** (minimi) | **`1.5rem` (`24px`)** | **Pakollinen minimi** rinnakkaisille syötekentille ja valitsimille (`AGENTS.md`). |
| **Allekkaiset suodattimet** | `gap={4}` | `1rem` (`16px`) | Sivupalkin tai pystysuuntaisen suodatinlohkon kenttien väli. |
| **Korttilista (`ul`)** | `gap={4}` | `1rem` (`16px`) | `<Stack as="ul" gap={4} listStyleType="none">` (`SchoolCard`, `DegreeStatsCard`, `CutoffCard`). |
| **Sarakkeellinen grid (`ul`)** | `gap={6}` | `1.5rem` (`24px`) | `<SimpleGrid as="ul" columns={{ base: 1, md: 2 }} gap={6} listStyleType="none">`. |
| **Haitarilista (`Accordion`)** | `gap={3}` | `0.75rem` (`12px`) | Erillisten haitaririvien väli, kun haitari toimii korttimaisena listana. |
| **Otsikko + kappale / lista** | `gap={2}` | `0.5rem` (`8px`) | Osion `h2`-otsikon ja sitä seuraavan tekstin tai listan väli tiiviissä osioissa. |
| **Label + arvo / otsikko + alaotsikko** | `gap={1}` | `0.25rem` (`4px`) | Kentän otsikko (`Field.Label`) ja kenttä, tai otsikko ja sen välitön selite. |

---

## 3. Typografia ja otsikkohierarkia

Jokaisessa `<Heading>`-komponentissa on aina oltava eksplisiittinen `as`-prop (`h1`–`h4`), eikä otsikkotasoja saa hypätä yli.

| Rooli | Toteutus | Tyyli ja käyttö |
| --- | --- | --- |
| **Sivun pääotsikko (`h1`)** | `<PageIntro title="..." />` | `fontSize={{ base: "24px", md: "36px" }}`, `fontWeight="semibold"`, `textWrap="balance"`. Vain yksi per sivu. |
| **Sivun kuvausteksti** | `<PageIntro description="..." />` | `color="fg.muted"`, `fontSize={{ base: "14px", md: "18px" }}`, `textWrap="pretty"`. |
| **Osion otsikko (`h2`)** | `<Heading as="h2" size="md">` | Sivun pääosiot (`PageContainer`in sisällä). |
| **Kortti- tai haitariosion otsikko (`h2` / `h3`)** | `<Heading as="h2" size="sm">` (tai `as="h3"`) | `TrendCard`, haitaririvien otsikot (`Accordion.ItemTrigger`), alaotsikot. |
| **Leipäteksti** | `<Text fontSize="sm">` tai oletus (`md`) | Työkalu- ja datasivuilla tiivis aputeksti on `fontSize="sm"`, oppaissa ja artikkeleissa `fontSize="md" lineHeight="tall"`. Käytä `textWrap="pretty"` monirivisissä teksteissä. |
| **Toissijainen teksti / selite** | `<Text color="fg.muted" fontSize="sm">` | Kuvaavat selitteet, tyhjät tilat ja korttien täydentävät rivit. |
| **Metatieto, lähde, tuloslaskuri ja kentän label** | `<Text color="fg.muted" fontSize="xs">` | Tulosmäärät (`120 tulosta`), lähdeviitteet (`Lähde: ...`) ja `Field.Label`. |
| **Numeerinen data** | `fontVariantNumeric="tabular-nums"` | Käytä taulukoissa, pisterajoissa, mittareissa ja vertailuluvuissa. |

---

## 4. Värit ja semanttiset tokenit (`src/theme.ts`)

Käytä Chakra-komponenteissa aina semanttisia tokeneita. Älä kovakoodaa OKLCH-, RGB- tai HEX-arvoja komponentteihin.

| Semanttinen token | Käyttötarkoitus |
| --- | --- |
| `bg` | Sivun ja korttien oletustausta. |
| `bg.muted` / `bg.panel` | Vaimea pinta: pudotusvalikot, taulukon otsikkorivi, mittaripalkin tausta (`BAR_TRACK`), `Callout`-laatikko, valitun välilehden indikaattori (`Tabs.Indicator`). |
| `fg` (tai `text`) | Ensisijainen tekstiväri. |
| `fg.muted` | Toissijainen teksti, aputekstit, kuvaukset, lähteet ja otsokkeet (`Stat.Label`, `Field.Label`). |
| `fg.accent` | Korostusteksti, linkkien korostus, aktiiviset ikonit ja korostetut tilastoluvut (täyttää ≥ 4.5:1 kontrastin taustaa vasten). |
| `accent` + `onAccent` | Korostetut täyttöpinnat: ensisijaiset CTA-painikkeet (`bg="accent" color="onAccent"`) ja koulubadget (`Badge bg="accent" color="onAccent"`). |
| `border` | Korttien, syötekenttien ja valitsimien oletusreuna. |
| `border.subtle` | Kevyemmät erottimet, taulukon solureunat ja lohkojen väliviivat. |
| `viz.field`, `viz.school`, `viz.sector`, `viz.trend`, `viz.ylituotos` | Kaavioiden ja datapalkkien värit. |

**Milloin käytetään `COLORS.*`-vakiota (`src/theme.ts`)?**
- Käytä `COLORS.accent`, `COLORS.accentFg`, `COLORS.border`, `COLORS.surfaceMuted` **vain** silloin, kun arvo annetaan CSS-merkkijonon sisällä (esim. `linear-gradient(...)`, `borderBottom={`1px solid ${COLORS.accentFg}`}`) tai kolmannen osapuolen komponentille kuten `react-icons`-ikonin `color`-ominaisuudelle.
- Tavallisissa Chakra-propseissa (`bg`, `color`, `borderColor`, `textDecorationColor`) käytä aina suoraan token-nimeä (`bg="accent"`, `color="onAccent"`, `color="fg.accent"`, `bg="bg.muted"`).

---

## 5. Yhtenäiset komponentit (`src/components/`)

### 5.1 Hakukenttä (`SearchInput`)
- Käytä **aina** komponenttia `@/components/SearchInput` ([src/components/SearchInput.tsx](src/components/SearchInput.tsx)). Älä luo sivuille erillisiä `<Input type="search">`-virityksiä.
- Vakioitu ulkoasu: `size="sm"`, `minHeight={9}`, `width="full"`.
- Jos hakukentän vieressä on muita kenttiä, joilla on näkyvä yläotsikko (`label`), anna `SearchInput`ille `label`-prop (esim. `label="Haku"`), jolloin se renderöi `Field.Root` + `Field.Label` (`color="fg.muted" fontSize="xs"`). Muussa tapauksessa se käyttää `placeholder`-tekstiä ja `aria-label`-nimeä.

### 5.2 Valitsin (`OptionSelect` ja `YearControl`)
- Käytä **aina** komponenttia `@/components/OptionSelect` ([src/components/OptionSelect.tsx](src/components/OptionSelect.tsx)) tai yhteishaun vuosivalinnassa `@/components/YearControl` ([src/components/YearControl.tsx](src/components/YearControl.tsx)).
- Älä käytä natiivia `<chakra.select>`-elementtiä tai sivukohtaisia kopioita (kuten erillistä `ResultSelect`-komponenttia suodatusrivillä).
- Vakioitu ulkoasu: `size="sm"`, `width="full"`.
- **Näkyvä otsikko (`label?: string`):**
  - Kun valitsin tarvitsee näkyvän yläotsikon (esim. `/pistelaskuri/`, `/trendit/`, `/ennakointi/`), anna `label`-prop: `<OptionSelect label="Järjestys" ... />`.
  - Kun valitsimen arvo on itsessään selkeä ilman yläotsikkoa (esim. `/koulutukset/`, `/hakijamaarat/`, `/lukiot/`), jätä `label` pois ja anna kuvaava `ariaLabel`.

### 5.3 Sivupalkin suodatinhaitari (`FilterAccordion`)
- Käytä `@/components/FilterAccordion` ([src/components/FilterAccordion.tsx](src/components/FilterAccordion.tsx)) `FilterItem`-, `toCollection`- ja `selectFilter`-osia.
- Kääri `FilterItem`-elementit aina `<Accordion.Root multiple size="sm">`-komponenttiin.

### 5.4 Välilehdet (`Tabs`)
- Käytä `<Tabs.Root size="sm">`.
- `Tabs.List` sisältää aina kuvaavan `aria-label`-attribuutin ja `<Tabs.Indicator bg="bg.muted" />`-elementin.
- `Tabs.Trigger`-vakiointi: `flex={1}`, `fontWeight="semibold"`, `justifyContent="center"`, `letterSpacing="wide"`.

### 5.5 Kortit (`Card.Root`) ja Haitarit (`Accordion.Root`)
- **Sisältökortit** (`SchoolCard`, `DegreeStatsCard`, `CutoffCard`, `TrendCard`):
  - Käytä `<Card.Root size="md">` (kompakteissa kuntakorteissa `size="sm"`).
  - Kun kortti on osa tuloslistaa (`<Stack as="ul">`), kortin juuri on `as="li"` (tai kääritty `<li>`-elementtiin).
  - Korkeakoulun nimi merkitään yhtenäisellä badgella: `<Badge bg="accent" color="onAccent">` ja `<HiLocationMarker aria-hidden="true" />`.
- **Sivun pääsisällön haitarilistat** (`/lukiot/`, `/pisterajat/@ala/`, `/koulut/@slug/pisterajat/`, `/pistelaskuri/`, `/ukk/`):
  - Jokainen `Accordion.ItemTrigger` kääritään semanttiseen otsikkoon (`<Heading as="h2" size="sm">` tai `as="h3"`).
  - Triggerin pystytäyte on `py={4}` ja avautuvan `Accordion.ItemBody`n alatäyte `pb={6}`.

### 5.6 Linkit ja painikkeet
- **Toiminnalliset/navigoivat nostolinkit** (`BackLink`, korttien toimintolinkit, hakemistolinkit):
  - `textDecoration="underline"`, `textDecorationColor="fg.accent"`, `textDecorationStyle="dotted"`.
- **Leipätekstin sisäiset linkit**:
  - `textDecoration="underline"` (ulkoisille linkeille aina `rel="noopener noreferrer" target="_blank"`).
- **Ensisijainen CTA-painike** (esim. `PistelaskuriCta`, lomakkeen lähetys):
  - `bg="accent"`, `color="onAccent"`, `size="sm"`.

### 5.7 Sivutus (`Pagination`)
- Käytä aina `@/components/Pagination` ([src/components/Pagination.tsx](src/components/Pagination.tsx)) tuloslistan alapuolella.

---

## 6. Tilaviestit ja metatiedot

### 6.1 Tuloslaskuri
- Sijoitetaan tuloslistan yläpuolelle oikeaan reunaan:
  ```tsx
  <Text aria-live="polite" color="fg.muted" fontSize="xs" ml="auto">
    {new Intl.NumberFormat("fi-FI").format(count)} {count === 1 ? "hakutulos" : "hakutulosta"}
  </Text>
  ```

### 6.2 Tyhjä tila ("Ei tuloksia")
- Kun suodatus tai haku ei tuota tuloksia, näytä yhtenäinen viesti ilman emojeja tai hymiöitä:
  ```tsx
  <Text color="fg.muted" fontSize="sm">
    Ei tuloksia valituilla hakuehdoilla.
  </Text>
  ```
  *(Jos tyhjä tila on `<ul>`-listan sisällä, lisää `as="li"`.)*

### 6.3 Virhetila ja lataustila
- **Virhe:** Käytä aina Chakran `Alert`-komponenttia:
  ```tsx
  <Alert.Root status="error">
    <Alert.Indicator />
    <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
  </Alert.Root>
  ```
- **Lataus:** Käytä joko kortin muotoista `Skeleton`-listaa (kuten `DegreeStatsCardSkeleton`) tai `aria-live="polite"`-alueen sisällä `<Text color="fg.muted" fontSize="sm">Ladataan…</Text>`.

### 6.4 Lähdeviite sivun alareunassa
- Sivun alareunan tietolähde merkitään aina yhtenäisesti:
  ```tsx
  <Text color="fg.muted" fontSize="xs">
    Lähde: Opetushallinnon tilastopalvelu Vipunen
  </Text>
  ```
- Käytä Vipusesta aina muotoa `Opetushallinnon tilastopalvelu Vipunen`.

