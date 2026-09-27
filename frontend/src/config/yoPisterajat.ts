export type YoKausi = "kevat" | "syksy";

export type YoPisterajaRoundId = `${number}-${YoKausi}`;

export const YO_GRADES = ["L", "E", "M", "C", "B", "A"] as const;

export type YoGrade = (typeof YO_GRADES)[number];

export const yoRoundId = (vuosi: number, kausi: YoKausi): YoPisterajaRoundId => `${vuosi}-${kausi}`;

export const yoRoundLabel = (id: YoPisterajaRoundId) => {
  const [year, season] = id.split("-");
  return `${season === "kevat" ? "Kevät" : "Syksy"} ${year}`;
};

export const compareYoRounds = (a: YoPisterajaRoundId, b: YoPisterajaRoundId) => b.localeCompare(a, "fi");
