import { Link, Text } from "@chakra-ui/react";

export const QUESTIONS = [
  {
    question: "Mistä sivulla näytettävä data on peräisin?",
    answerText:
      "Data haetaan kolmannen osapuolen avoimista rajapinnoista. Hakijamäärät ovat peräisin Opetushallituksen tilastopalvelu Vipunen.fi:stä ja koulutukset Opintopolku.fi:stä.",
    answer: (
      <>
        Data haetaan kolmannen osapuolen avoimista rajapinnoista.
        <br />
        <Text as="span" fontWeight="semibold">
          Hakijamäärät:
        </Text>{" "}
        Opetushallituksen tilastopalvelu Vipunen.fi
        <br />
        <Text as="span" fontWeight="semibold">
          Koulutukset:
        </Text>{" "}
        Opintopolku.fi
      </>
    ),
  },
  {
    question: "Kuinka usein tiedot päivittyvät?",
    answerText:
      "Koulutuksia ja hakijamäärien tilastoja päivitetään sitä mukaa, kun uutta dataa julkaistaan. Suuntaa antava aikataulu löytyy Vipunen.fi-sivun päivitysaikataulusta.",
    answer: (
      <>
        Koulutuksia ja hakijamäärien tilastoja päivitetään sitä mukaa kun uutta dataa julkaistaan. Suuntaa antava
        aikataulu löytyy{" "}
        <Link
          color="fg.accent"
          href="https://vipunen.fi/fi-fi/yhteiset/Sivut/Tietojen-p%C3%A4ivittymisen-aikataulu---haku-ja-valinta.aspx"
          rel="noopener noreferrer"
          target="_blank"
        >
          Vipunen.fi
        </Link>{" "}
        -sivun aikataulusta.
      </>
    ),
  },
  {
    question: "Mihin hakijapaine perustuu?",
    answerText:
      "Hakijamäärät- ja vertailusivuilla näkyvä koulutuksen hakijapaine perustuu ensisijaisten hakijoiden ja aloituspaikkojen suhteeseen.",
    answer: (
      <>
        Hakijamäärät ja vertailu -sivuilla näkyvän koulutuksen{" "}
        <Text as="span" fontStyle="italic">
          hakijapaine
        </Text>{" "}
        perustuu suhdelukuun: <br />
        <Text as="span" fontWeight="semibold">
          ensisijaiset hakijat / aloituspaikat
        </Text>
        .
      </>
    ),
  },
  {
    question: "Mitä sisäänpääsyprosentti tarkoittaa?",
    answerText:
      "Sisäänpääsyprosentti on valittujen osuus kaikista hakukohteen hakijoista. Se lasketaan jakamalla valittujen määrä kaikkien hakijoiden määrällä.",
    answer: (
      <>
        Sisäänpääsyprosentti on valittujen osuus kaikista hakukohteen hakijoista. Se lasketaan kaavalla: <br />
        <Text as="span" fontWeight="semibold">
          valitut / kaikki hakijat × 100
        </Text>
        .<br />
        Esimerkiksi 10 % tarkoittaa, että hakukohteeseen valittiin noin yksi opiskelija kymmentä hakijaa kohden. Luku
        perustuu kyseisen vuoden toteutuneisiin valintoihin.
      </>
    ),
  },
  {
    question: "Kuka on tehnyt yhteishaku.app-sivun?",
    answerText:
      "Sivua kehittää ja ylläpitää yksi henkilö harrastusprojektina. Yhteishaku.app ei ole Opetushallituksen, Opintopolun tai muun viranomaisen ylläpitämä palvelu. Sivuston lähdekoodi löytyy GitHubista.",
    answer: (
      <>
        Sivua kehittää ja ylläpitää yksi henkilö harrastusprojektina.
        <br />
        <br />
        Yhteishaku.app{" "}
        <Text as="span" fontWeight="bold">
          ei ole
        </Text>{" "}
        Opetushallituksen, Opintopolun tai muun viranomaisen ylläpitämä palvelu.
        <br />
        <br />
        Sivuston lähdekoodi löytyy avoimena{" "}
        <Link
          color="fg.accent"
          href="https://github.com/miko-kortelainen/koulutus-info"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHubista
        </Link>
        .
      </>
    ),
  },
  {
    question: "Miten lisään yhteishaku.app-palvelun iPhonen Koti-valikkoon?",
    answerText: "Palvelun voi lisätä iPhonen Koti-valikkoon Safarissa sivuston asennusohjeiden avulla.",
    answer: (
      <>
        Se onnistuu Safarissa muutamalla painalluksella. <br />
        Katso{" "}
        <Link color="fg.accent" href="/asenna/">
          lyhyet ohjeet
        </Link>
        .
      </>
    ),
  },
];
