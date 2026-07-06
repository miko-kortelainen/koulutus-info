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
        Tiedot päivitetään sitä mukaa kun uutta dataa julkaistaan. Suuntaa antava aikataulu löytyy{" "}
        <Link
          href="https://vipunen.fi/fi-fi/yhteiset/Sivut/Tietojen-p%C3%A4ivittymisen-aikataulu---haku-ja-valinta.aspx"
          color="blue.500"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vipunen.fi
        </Link>{" "}
        -sivun aikataulusta.
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
        perustuu kaavaan: <br />
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
          href="https://github.com/miko-kortelainen/koulutus-info"
          color="blue.500"
          target="_blank"
          rel="noopener noreferrer"
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

const questionList = QUESTIONS.map(({ question, answer }) => (
  <Accordion.Item key={question} value={question}>
    <Accordion.ItemTrigger>
      <Heading size="md" flex="1" textAlign="start">
        {question}
      </Heading>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <Text textWrap="pretty" color="fg.muted" fontSize={{ base: "sm", md: "md" }}>
          {answer}
        </Text>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
));

export default function UKKPage() {
  return (
    <PageContainer>
      {header}
      <Stack gap={6} py={8}>
        <Accordion.Root collapsible>{questionList}</Accordion.Root>
      </Stack>
    </PageContainer>
  );
}
