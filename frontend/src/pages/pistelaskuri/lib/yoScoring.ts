// Pisteytysmalli: Taulukko 1, "Ammattikorkeakoulujen todistusvalinnassa käytettävät pisteytysmallit"
// (ammattikorkeakouluun.fi), voimassa vuoden 2026 haussa.
export type YoGrade = "L" | "E" | "M" | "C" | "B" | "A";

export const YO_GRADES: YoGrade[] = ["L", "E", "M", "C", "B", "A"];

type GradeTable = Record<YoGrade, number>;

const AIDINKIELI: GradeTable = { L: 46, E: 41, M: 34, C: 26, B: 18, A: 10 };
const MATEMATIIKKA_PITKA: GradeTable = { L: 46, E: 43, M: 40, C: 35, B: 27, A: 19 };
const MATEMATIIKKA_LYHYT: GradeTable = { L: 40, E: 35, M: 27, C: 19, B: 13, A: 6 };
// Sama taulukko kuin äidinkielellä.
const KIELI_PITKA: GradeTable = AIDINKIELI;
const KIELI_KESKIPITKA: GradeTable = { L: 38, E: 34, M: 26, C: 18, B: 12, A: 5 };
const KIELI_LYHYT: GradeTable = { L: 30, E: 27, M: 21, C: 15, B: 9, A: 3 };
// Reaaliaineet ja "ylimääräinen" vieras kieli pisteytetään samalla asteikolla kuin lyhyt kieli.
const REAALI: GradeTable = KIELI_LYHYT;

export const YO_MAX_SCORE = 198;

export type MathLevel = "pitkä" | "lyhyt";
export type KieliLevel = "pitkä" | "keskipitkä" | "lyhyt";
export type KieliType = "kotimainen" | "vieras";

export const REAALIAINEET = [
  "Fysiikka",
  "Kemia",
  "Biologia",
  "Maantiede",
  "Terveystieto",
  "Psykologia",
  "Filosofia",
  "Historia",
  "Yhteiskuntaoppi",
  "Uskonto/ET",
] as const;

export interface YoKieli {
  type: KieliType;
  level: KieliLevel;
  grade: YoGrade;
}

export interface YoReaaliaine {
  subject: string;
  grade: YoGrade;
}

export interface YoInput {
  aidinkieli: YoGrade;
  matematiikka?: { level: MathLevel; grade: YoGrade };
  kielet: YoKieli[];
  reaaliaineet: YoReaaliaine[];
}

const kieliTable = (level: KieliLevel): GradeTable =>
  level === "pitkä" ? KIELI_PITKA : level === "keskipitkä" ? KIELI_KESKIPITKA : KIELI_LYHYT;

// Vuoden 2026 mallissa toinen kotimainen kieli kelpaa vain kielipaikalle, ei reaaliaine-/vieraskielipaikoille.
// Vieras kieli kelpaa reaaliaine-/vieraskielipaikalle vain pitkänä tai lyhyenä, ei keskipitkänä.
const reaaliSlotValue = (kieli: YoKieli): number | null =>
  kieli.type === "vieras" && kieli.level !== "keskipitkä" ? REAALI[kieli.grade] : null;

const sumTopTwo = (values: number[]): number =>
  [...values]
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((sum, value) => sum + value, 0);

/**
 * Kokeilee jokaisen kirjoitetun kielen kielipaikan haltijaksi (tai ei ketään), ja täyttää
 * kaksi reaaliainepaikkaa parhailla jäljelle jäävillä suorituksilla, jotta löydetään aidosti
 * eniten pisteitä tuottava enintään viiden aineen yhdistelmä.
 */
export const calculateYoScore = (input: YoInput): number => {
  const aidinkielePoints = AIDINKIELI[input.aidinkieli];
  const matematiikkaPoints = input.matematiikka
    ? (input.matematiikka.level === "pitkä" ? MATEMATIIKKA_PITKA : MATEMATIIKKA_LYHYT)[input.matematiikka.grade]
    : 0;

  const reaaliaineValues = input.reaaliaineet.map((reaaliaine) => REAALI[reaaliaine.grade]);

  let bestKieliJaReaali = sumTopTwo(reaaliaineValues);

  input.kielet.forEach((chosen, index) => {
    const kieliPoints = kieliTable(chosen.level)[chosen.grade];
    const remainingReaaliValues = [
      ...reaaliaineValues,
      ...input.kielet
        .filter((_, otherIndex) => otherIndex !== index)
        .map(reaaliSlotValue)
        .filter((value): value is number => value !== null),
    ];
    bestKieliJaReaali = Math.max(bestKieliJaReaali, kieliPoints + sumTopTwo(remainingReaaliValues));
  });

  return aidinkielePoints + matematiikkaPoints + bestKieliJaReaali;
};
