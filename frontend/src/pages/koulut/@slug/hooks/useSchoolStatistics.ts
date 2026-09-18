import type { YearOption } from "@/config/yearOptions";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import type { StatisticsEntry } from "@/types.gen";

function schoolRows(entries: StatisticsEntry[] | undefined, schoolName: string): StatisticsEntry[] {
  return (entries ?? [])
    .filter((entry) => entry.korkeakoulu === schoolName)
    .sort((a, b) => b.ensisijaisetHakijatLkm - a.ensisijaisetHakijatLkm);
}

export default function useSchoolStatistics(
  schoolName: string,
  selectedYear: YearOption,
  statisticsYear: YearOption,
  initialStatistics: StatisticsEntry[],
) {
  const usingInitialYear = selectedYear === statisticsYear;
  const query = useStatisticsQuery(selectedYear, undefined, !usingInitialYear);
  const dataReady = usingInitialYear || query.isSuccess;
  const showError = !usingInitialYear && query.isError;
  const rows = usingInitialYear ? initialStatistics : schoolRows(query.data, schoolName);

  return {
    dataReady,
    isUpdating: !usingInitialYear && query.isFetching,
    rows,
    showError,
    showLoading: !usingInitialYear && query.isPending,
  };
}
