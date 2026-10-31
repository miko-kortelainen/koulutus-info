import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";

export default function TietosuojaselostePage() {
  return (
    <>
      <PageIntro
        description="Tietoa yhteishaku.app-verkkopalvelun henkilötietojen käsittelystä, analytiikasta ja tietolähteistä."
        title="Tietosuojaseloste"
      />
      <PageContainer align="flex-start">
        <Stack fontSize="sm" gap={6} width="full">
          <Stack as="section" gap={2}>
            <Heading as="h2" size="md">
              Rekisterinpitäjä
            </Heading>
            <Text>Yhteishaku.app on yksityishenkilön ylläpitämä verkkopalvelu.</Text>
            <Text>
              Yhteystiedot:{" "}
              <Link color="fg.accent" href="mailto:miko@kortelainen.dev" textDecoration="underline">
                miko@kortelainen.dev
              </Link>
            </Text>
          </Stack>

          <Stack as="section" gap={2}>
            <Heading as="h2" size="md">
              Henkilötietojen käsittely
            </Heading>
            <Text>Yhteishaku.app ei pyydä käyttäjältä nimeä tai yhteystietoja eikä käytä markkinointipalveluita.</Text>
            <Text textWrap="pretty">
              Verkkopalvelun teknisestä toimittamisesta vastaavat GitHub Pages ja Cloudflare. Ne voivat käsitellä
              esimerkiksi IP-osoitteita ja muita teknisiä tietoja palvelun tarjoamiseksi ja tietoturvan varmistamiseksi.
              Todistusvalintalaskuri laskee pisteet selaimessa paikallisesti.
            </Text>
          </Stack>

          <Stack as="section" gap={2}>
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
                  textDecoration="underline"
                >
                  Cloudflare Web Analytics
                </Link>
              </li>
              <li>
                <Link
                  color="fg.accent"
                  href="https://www.simpleanalytics.com"
                  rel="noopener noreferrer"
                  target="_blank"
                  textDecoration="underline"
                >
                  Simple Analytics
                </Link>
              </li>
            </Stack>
            <Text>Tutustu palveluiden tietosuojakäytäntöihin niiden omilla sivuilla.</Text>
          </Stack>

          <Stack as="section" gap={2}>
            <Heading as="h2" size="md">
              Palaute
            </Heading>
            <Text textWrap="pretty">
              Palautelomake käyttää{" "}
              <Link
                color="fg.accent"
                href="https://formsubmit.co"
                rel="noopener noreferrer"
                target="_blank"
                textDecoration="underline"
              >
                FormSubmit-palvelua
              </Link>
              . Kun lähetät palautteen, lomakkeeseen kirjoittamasi sisältö välitetään FormSubmitin kautta palvelun
              ylläpitäjän sähköpostiin. Älä kirjoita palautteeseen tarpeettomia henkilötietoja.
            </Text>
          </Stack>

          <Stack as="section" gap={2}>
            <Heading as="h2" size="md">
              Tietolähteet
            </Heading>
            <Text>Palvelussa käytetyt lähteet ovat:</Text>
            <Stack as="ul" gap={1} listStyleType="disc" pl={4}>
              <li>
                <Link
                  color="fg.accent"
                  href="https://vipunen.fi"
                  rel="noopener noreferrer"
                  target="_blank"
                  textDecoration="underline"
                >
                  Opetushallinnon tilastopalvelu Vipunen
                </Link>
              </li>
              <li>
                <Link
                  color="fg.accent"
                  href="https://opintopolku.fi"
                  rel="noopener noreferrer"
                  target="_blank"
                  textDecoration="underline"
                >
                  Opintopolku.fi
                </Link>
              </li>
            </Stack>
          </Stack>
        </Stack>
      </PageContainer>
    </>
  );
}
