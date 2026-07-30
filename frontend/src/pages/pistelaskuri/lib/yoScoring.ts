export type YoGrade = "L" | "E" | "M" | "C" | "B" | "A" | "I";

export const YO_GRADES: YoGrade[] = ["L", "E", "M", "C", "B", "A", "I"];

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
  "Elämänkatsomustieto",
  "Evankelis-luterilainen uskonto",
  "Ortodoksinen uskonto",
] as const;

export type RealSubject = (typeof REAALIAINEET)[number];

export interface YoKieli {
  type: KieliType;
  level: KieliLevel;
  grade: YoGrade;
}

export interface YoReaaliaine {
  subject: RealSubject;
  grade: YoGrade;
}

export interface YoInput {
  aidinkieli: YoGrade;
  matematiikka?: { level: MathLevel; grade: YoGrade };
  kielet: YoKieli[];
  reaaliaineet: YoReaaliaine[];
}
