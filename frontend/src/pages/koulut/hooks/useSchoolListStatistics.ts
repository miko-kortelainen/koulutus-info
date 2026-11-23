import { useState } from "react";
import { DEFAULT_SCHOOL_LIST_YEAR, type YearOption } from "@/config/yearOptions";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import type { SchoolListItem } from "@/pages/koulut/+data";
import { applyYearStatistics } from "@/pages/koulut/lib/applyYearStatistics";

export default function useSchoolListStatistics(schools: SchoolListItem[]) {
  const [selectedYear, setSelectedYear] = useState<YearOption>(DEFAULT_SCHOOL_LIST_YEAR);
  const usingInitialYear = selectedYear === DEFAULT_SCHOOL_LIST_YEAR;
  const query = useStatisticsQuery(selectedYear, undefined, !usingInitialYear);
  const dataReady = usingInitialYear || query.isSuccess;
  const yearSchools = usingInitialYear
    ? schools
    : query.isSuccess
      ? applyYearStatistics(schools, query.data ?? [])
      : [];

  return {
    dataReady,
    isUpdating: !usingInitialYear && query.isFetching,
    selectedYear,
    setSelectedYear,
    showError: !usingInitialYear && query.isError,
    showLoading: !usingInitialYear && query.isPending,
    yearSchools,
  };
}
