export const SCORE_TYPES = [
  { label: "Todistuspisteet (AMM)", value: "Todistusvalinta (AMM)" },
  { label: "Todistuspisteet (YO)", value: "Todistusvalinta (YO)" },
  { label: "Valintakoepisteet", value: "AMK-valintakoe" },
] as const;

export type ScoreType = (typeof SCORE_TYPES)[number]["value"];

export const isScoreType = (value: string): value is ScoreType =>
  SCORE_TYPES.some((scoreType) => scoreType.value === value);
