import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import PageContainer from "../../layout/PageContainer";

export default function TietosuojaselosteePage() {
  return (
    <PageContainer align="flex-start">
      <Stack gap={6} py={8}>
        <Heading as="h1" size="2xl">
          Tietosuojaseloste
        </Heading>

        <Stack gap={2}>
          <Heading size="md">Rekisterinpitäjä</Heading>
          <Text>Yhteishaku.app on yksityishenkilön ylläpitämä verkkopalvelu.</Text>
          <Text>
            Yhteystiedot:{" "}
            <Link color="blue.500" href="mailto:miko.kortelainen@proton.me">
              miko.kortelainen@proton.me
            </Link>
          </Text>
        </Stack>

        <Stack gap={2}>
          <Heading size="md">Henkilötietojen käsittely</Heading>
          <Text>Yhteishaku.app ei kerää henkilötietoja eikä käytä markkinointipalveluita.</Text>
          <Text>
            Verkkopalvelun teknisestä toimittamisesta vastaavat GitHub Pages ja Cloudflare, jotka voivat käsitellä
            esimerkiksi IP-osoitteita ja muita teknisiä tietoja palvelun tarjoamiseksi ja tietoturvan varmistamiseksi.
          </Text>
          <Text>
            Palvelu käyttää{" "}
            <Link
              color="blue.500"
              href="https://www.cloudflare.com/web-analytics/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Cloudflare Web Analyticsia
            </Link>{" "}
            kävijätilastojen seurantaan. <br />
            Cloudflare kerää tietoa kuten sivulatausmäärät ja selaintyypit ilman evästeitä tai yksilöivien tunnisteiden
            tallentamista.
          </Text>
          <Text>
            Palvelu käyttää myös{" "}
            <Link color="blue.500" href="https://www.simpleanalytics.com" rel="noopener noreferrer" target="_blank">
              Simple Analyticsia
            </Link>{" "}
            kävijätilastojen seurantaan. <br />
            Simple Analytics ei käytä evästeitä eikä kerää henkilötietoja tai yksilöiviä tunnisteita.
          </Text>
        </Stack>

        <Stack gap={2}>
          <Heading size="md">Tietolähteet</Heading>
          <Text>Palvelussa käytetyt lähteet ovat:</Text>
          <Stack as="ul" gap={1} listStyleType="disc" pl={4}>
            <li>
              <Link color="blue.500" href="https://vipunen.fi" rel="noopener noreferrer" target="_blank">
                Opetushallituksen tilastopalvelu Vipunen
              </Link>
            </li>
            <li>
              <Link color="blue.500" href="https://opintopolku.fi" rel="noopener noreferrer" target="_blank">
                Opintopolku.fi
              </Link>
            </li>
          </Stack>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
