import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";

export default function TietosuojaselostePage() {
  return (
    <PageContainer align="flex-start">
      <Stack fontSize="sm" gap={6} py={8}>
        <Heading as="h1" size="2xl">
          Tietosuojaseloste
        </Heading>

        <Stack gap={2}>
          <Heading as="h2" size="md">
            Rekisterinpitäjä
          </Heading>
          <Text>Yhteishaku.app on yksityishenkilön ylläpitämä verkkopalvelu.</Text>
          <Text>
            Yhteystiedot:{" "}
            <Link color="fg.accent" href="mailto:miko.kortelainen@proton.me">
              miko.kortelainen@proton.me
            </Link>
          </Text>
        </Stack>

        <Stack gap={2}>
          <Heading as="h2" size="md">
            Henkilötietojen käsittely
          </Heading>
          <Text>Yhteishaku.app ei pyydä käyttäjältä nimeä tai yhteystietoja eikä käytä markkinointipalveluita.</Text>
          <Text>
            Verkkopalvelun teknisestä toimittamisesta vastaavat GitHub Pages ja Cloudflare, jotka voivat käsitellä
            esimerkiksi IP-osoitteita ja muita teknisiä tietoja palvelun tarjoamiseksi ja tietoturvan varmistamiseksi.
          </Text>
        </Stack>

        <Stack gap={2}>
          <Heading as="h2" size="md">
            Analytiikka
          </Heading>
          <Text>Yhteishaku.app käyttää kävijämäärien seurantaan:</Text>
          <Stack as="ul" gap={1} listStyleType="disc" pl={4}>
            <li>
              <Link
                color="fg.accent"
                href="https://www.cloudflare.com/web-analytics/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Cloudflare Web Analytics
              </Link>
            </li>
            <li>
              <Link color="fg.accent" href="https://www.simpleanalytics.com" rel="noopener noreferrer" target="_blank">
                Simple Analytics
              </Link>
            </li>
          </Stack>
          <Text>Tutustu palveluiden tietosuojakäytäntöihin niiden omilla sivuilla.</Text>
        </Stack>

        <Stack gap={2}>
          <Heading as="h2" size="md">
            Palaute
          </Heading>
          <Text>
            Palautelomake käyttää{" "}
            <Link color="fg.accent" href="https://formsubmit.co" rel="noopener noreferrer" target="_blank">
              FormSubmit-palvelua
            </Link>
            . Kun lähetät palautteen, lomakkeeseen kirjoittamasi sisältö välitetään FormSubmitin kautta palvelun
            ylläpitäjän sähköpostiin. Älä kirjoita palautteeseen tarpeettomia henkilötietoja.
          </Text>
        </Stack>

        <Stack gap={2}>
          <Heading as="h2" size="md">
            Tietolähteet
          </Heading>
          <Text>Palvelussa käytetyt lähteet ovat:</Text>
          <Stack as="ul" gap={1} listStyleType="disc" pl={4}>
            <li>
              <Link color="fg.accent" href="https://vipunen.fi" rel="noopener noreferrer" target="_blank">
                Opetushallituksen tilastopalvelu Vipunen
              </Link>
            </li>
            <li>
              <Link color="fg.accent" href="https://opintopolku.fi" rel="noopener noreferrer" target="_blank">
                Opintopolku.fi
              </Link>
            </li>
          </Stack>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
