/** Formats meta.statisticsUpdatedAt as dd.mm.yyyy in Europe/Helsinki. */
export function formatStatisticsUpdatedAt(iso: string): string {
  const parts = new Intl.DateTimeFormat("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Helsinki",
  }).formatToParts(new Date(iso));
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return `${day}.${month}.${year}`;
}
