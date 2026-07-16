import { Accordion, Heading, Link, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";

const QUESTIONS = [
  {
    question: "Mistä sivulla näytettävä data on peräisin?",
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
    answer: (
      <>
        Koulutuksia ja hakijamäärien tilastoja päivitetään sitä mukaa kun uutta dataa julkaistaan. Suuntaa antava
        aikataulu löytyy{" "}
        <Link
          color="blue.500"
          href="https://vipunen.fi/fi-fi/yhteiset/Sivut/Tietojen-p%C3%A4ivittymisen-aikataulu---haku-ja-valinta.aspx"
          rel="noopener noreferrer"
          target="_blank"
        >
          Vipunen.fi
        </Link>{" "}
        -sivun aikataulusta. <br /> <br />
        Sivun alaosasta näät milloin sivua on viimeksi päivitetty.
      </>
    ),
  },
  {
    question: "Mihin hakijapaine perustuu?",
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
    question: "Kuka on tehnyt yhteishaku.app- sivun?",
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
          color="blue.500"
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
];

const header = (
  <Heading as="h1" size="lg">
    Usein kysytyt kysymykset
  </Heading>
);

const questionAccordions = QUESTIONS.map(({ question, answer }) => (
  <Accordion.Item key={question} value={question}>
    <Accordion.ItemTrigger>
      <Text flex="1" fontSize="md" textAlign="start">
        {question}
      </Text>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }} textWrap="pretty">
          {answer}
        </Text>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
));

const questionStack = (
  <Stack gap={6} py={2}>
    <Accordion.Root collapsible>{questionAccordions}</Accordion.Root>
  </Stack>
);

export default function UKKPage() {
  return (
    <PageContainer align="flex-start">
      {header}
      {questionStack}
    </PageContainer>
  );
}
