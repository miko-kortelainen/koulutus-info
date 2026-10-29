import { Alert, Link, Skeleton, Stack, Text } from "@chakra-ui/react";
import { type ReactNode, useSyncExternalStore } from "react";
import { usePageContext } from "vike-react/usePageContext";
import ShareButton from "@/components/ShareButton";
import { CURRENT_YEAR, YEAR_OPTIONS, type YearOption } from "@/config/yearOptions";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import ComparisonTable from "@/pages/vertaile/components/ComparisonTable";

export default function ComparePage() {
  const { urlParsed } = usePageContext();
  // params are read only after hydration: the prerendered HTML has no query string, so
  // rendering them during hydration would mismatch the static markup
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { a, b, vuosi, vuosi_b } = mounted ? urlParsed.search : {};
  const year: YearOption = YEAR_OPTIONS.some((y) => y.value === vuosi) ? (vuosi as YearOption) : CURRENT_YEAR;
  const yearB: YearOption = YEAR_OPTIONS.some((y) => y.value === vuosi_b) ? (vuosi_b as YearOption) : year;
  const hasParams = Boolean(a && b);
  const query = useStatisticsQuery(year, undefined, hasParams);
  const queryB = useStatisticsQuery(yearB, undefined, hasParams);

  const entryA = query.data?.find((e) => e.kooditHakukohde === a);
  const entryB = queryB.data?.find((e) => e.kooditHakukohde === b);

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
  } else if (hasParams && (query.isPending || queryB.isPending)) {
    body = (
      <Stack gap={2}>
        <Skeleton height="10" />
        <Skeleton height="80" />
      </Stack>
    );
  } else if (query.isError || queryB.isError) {
    body = (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
      </Alert.Root>
    );
  } else if (query.isSuccess && queryB.isSuccess && (!entryA || !entryB)) {
    body = (
      <Stack gap={2}>
        <Text>Hakukohteita ei löytynyt valitusta yhteishausta.</Text>
        {backLink}
      </Stack>
    );
  } else if (entryA && entryB) {
    body = (
      <Stack align="flex-start" gap={4}>
        <ComparisonTable a={entryA} b={entryB} yearA={year} yearB={yearB} />

        <ShareButton label="Jaa tämä vertailu" onShared={() => window.sa_event?.("share_comparison")} />
      </Stack>
    );
  }

  return (
    <>
      <PageIntro description="Vertaa kahta hakukohdetta rinnakkain." title="Vertailu" />
      <PageContainer align="flex-start">{body}</PageContainer>
    </>
  );
}
