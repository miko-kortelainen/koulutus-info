import { Alert, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import DegreeStatsCard from "@/components/DegreeStatsCard";
import Pagination from "@/components/Pagination";
import YearControl from "@/components/YearControl";
import type { YearOption } from "@/config/yearOptions";
import useSchoolStatistics from "@/pages/koulut/@slug/hooks/useSchoolStatistics";
import type { StatisticsEntry } from "@/types.gen";

interface SchoolStatisticsProps {
  initialStatistics: StatisticsEntry[];
  schoolName: string;
  statisticsYear: YearOption;
}

const PAGE_SIZE = 5;

export default function SchoolStatistics({ initialStatistics, schoolName, statisticsYear }: SchoolStatisticsProps) {
  const [selectedYear, setSelectedYear] = useState<YearOption>(statisticsYear);
  const [page, setPage] = useState(1);
  const { dataReady, isUpdating, rows, showError, showLoading } = useSchoolStatistics(
    schoolName,
    selectedYear,
    statisticsYear,
    initialStatistics,
  );
  const paginated = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const yearControl = (
    <YearControl
      onChange={(year) => {
        setSelectedYear(year);
        setPage(1);
      }}
      value={selectedYear}
    />
  );

  const status = (
    <div aria-atomic="true" aria-live="polite">
      {showLoading ? (
        <Text color="fg.muted" fontSize="sm">
          Ladataan hakijamääriä…
        </Text>
      ) : null}
      {showError ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
        </Alert.Root>
      ) : null}
    </div>
  );

  const statsList = (
    <Stack
      aria-busy={isUpdating || undefined}
      as="ul"
      gap={4}
      listStyleType="none"
      opacity={isUpdating && dataReady ? 0.5 : 1}
    >
      {dataReady && !showError && paginated.length === 0 ? (
        <Text as="li">Ei hakijamääriä tälle yhteishaulle.</Text>
      ) : null}
      {dataReady && !showError
        ? paginated.map((degree) => <DegreeStatsCard degree={degree} key={degree.kooditHakukohde} />)
        : null}
    </Stack>
  );

  return (
    <Stack gap={4}>
      {yearControl}
      {status}
      {statsList}
      {dataReady && !showError && rows.length > 0 ? (
        <Pagination count={rows.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
      ) : null}
    </Stack>
  );
}
