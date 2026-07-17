import { Alert, Heading, Link, Separator, Skeleton, Stack, Text } from "@chakra-ui/react";
import { type ReactNode, useSyncExternalStore } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { CURRENT_YEAR, statisticsRoundShortLabel, YEAR_OPTIONS, type YearOption } from "@/config/yearOptions";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import PageContainer from "@/layout/PageContainer";
import ComparisonTable from "./components/ComparisonTable";

export default function ComparePage() {
  const { urlParsed } = usePageContext();
  // params are read only after hydration: the prerendered HTML has no query string, so
  // rendering them during hydration would mismatch the static markup
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { a, b, vuosi } = mounted ? urlParsed.search : {};
  const year: YearOption = YEAR_OPTIONS.some((y) => y.value === vuosi) ? (vuosi as YearOption) : CURRENT_YEAR;
  const hasParams = Boolean(a && b);
  const query = useStatisticsQuery(year, undefined, hasParams);

  const entryA = query.data?.find((e) => e.kooditHakukohde === a);
  const entryB = query.data?.find((e) => e.kooditHakukohde === b);

  const backLink = (
    <Text>
      Valitse vertailtavat hakukohteet{" "}
      <Link href="/hakijamaarat/" textDecoration="underline">
        hakijamäärät-sivulta
      </Link>
    </Text>
  );

  let body: ReactNode = null;
  if (mounted && !hasParams) {
    body = backLink;
  } else if (hasParams && query.isPending) {
    body = (
      <Stack gap={2}>
        <Skeleton height="10" />
        <Skeleton height="80" />
      </Stack>
    );
  } else if (query.isError) {
    body = (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
      </Alert.Root>
    );
  } else if (query.isSuccess && (!entryA || !entryB)) {
    body = (
      <Stack gap={2}>
        <Text>Hakukohteita ei löytynyt valitusta yhteishausta.</Text>
        {backLink}
      </Stack>
    );
  } else if (entryA && entryB) {
    body = <ComparisonTable a={entryA} b={entryB} />;
  }

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Vertailu
      </Heading>
      <Text color="fg.muted">
        Vertaa kahta hakukohdetta rinnakkain. <br /> Yhteishaku {statisticsRoundShortLabel(year)}.
      </Text>
      <Separator my={2} />
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      {body}
    </PageContainer>
  );
}
