import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import PageContainer from "../../layout/PageContainer";

export default function TietosuojaselosteePage() {
  return (
    <PageContainer>
      <Stack gap={6} py={8}>
        <Heading as="h1" size="2xl">
          Tietosuojaseloste
        </Heading>

        <Stack gap={2}>
          <Heading size="md">Rekisterinpitäjä</Heading>
          <Text>Yhteishaku.app on yksityishenkilön ylläpitämä verkkopalvelu.</Text>
          <Text>
            Yhteystiedot:{" "}
            <Link href="mailto:miko.kortelainen@proton.me" color="blue.500">
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
              href="https://www.cloudflare.com/web-analytics/"
              color="blue.500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare Web Analyticsia
            </Link>{" "}
            kävijätilastojen seurantaan. <br />
            Cloudflare kerää tietoa kuten sivulatausmäärät ja selaintyypit ilman evästeitä tai yksilöivien tunnisteiden
            tallentamista.
          </Text>
        </Stack>

        <Stack gap={2}>
          <Heading size="md">Tietolähteet</Heading>
          <Text>Palvelussa käytetyt lähteet ovat:</Text>
          <Stack as="ul" gap={1} pl={4} listStyleType="disc">
            <li>
              <Link href="https://vipunen.fi" color="blue.500" target="_blank" rel="noopener noreferrer">
                Opetushallituksen tilastopalvelu Vipunen
              </Link>
            </li>
            <li>
              <Link href="https://opintopolku.fi" color="blue.500" target="_blank" rel="noopener noreferrer">
                Opintopolku.fi
              </Link>
            </li>
          </Stack>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
