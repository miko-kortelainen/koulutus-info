export interface YhteishakuRound {
  label: string;
  start: string;
  end: string;
}

export const YHTEISHAKU_ROUNDS: YhteishakuRound[] = [
  { label: "Kevään 1. yhteishaku", start: "2026-01-07T08:00:00", end: "2026-01-21T15:00:00" },
  { label: "Kevään 2. yhteishaku", start: "2026-03-10T08:00:00", end: "2026-03-24T15:00:00" },
  { label: "Syksyn yhteishaku", start: "2026-08-31T08:00:00", end: "2026-09-10T15:00:00" },
];
