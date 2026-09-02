/** Formats meta.statisticsUpdatedAt as d.m.yyyy in Europe/Helsinki. */
export function formatStatisticsUpdatedAt(iso: string): string {
  return new Intl.DateTimeFormat("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "Europe/Helsinki",
  }).format(new Date(iso));
}
