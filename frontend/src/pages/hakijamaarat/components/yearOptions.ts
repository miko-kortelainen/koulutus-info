export const YEAR_OPTIONS = [
  { label: "Tilastovuosi 2026", value: "2026" },
  { label: "Tilastovuosi 2025", value: "2025" },
  { label: "Tilastovuosi 2024", value: "2024" },
  { label: "Tilastovuosi 2023", value: "2023" },
  { label: "Tilastovuosi 2022", value: "2022" },
  { label: "Tilastovuosi 2021", value: "2021" },
  { label: "Tilastovuosi 2020", value: "2020" },
  { label: "Tilastovuosi 2019", value: "2019" },
  { label: "Tilastovuosi 2018", value: "2018" },
] as const;

export type YearOption = (typeof YEAR_OPTIONS)[number]["value"];

export const CURRENT_YEAR = YEAR_OPTIONS[0].value;
