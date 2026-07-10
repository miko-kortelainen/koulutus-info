import { CURRENT_STATISTICS_YEAR, STATISTICS_YEARS } from "@/generated/dataManifest";

export const YEAR_OPTIONS = STATISTICS_YEARS.map((year) => ({
  label: `Tilastovuosi ${year}`,
  value: String(year),
}));

export type YearOption = string;

export const CURRENT_YEAR = CURRENT_STATISTICS_YEAR;
