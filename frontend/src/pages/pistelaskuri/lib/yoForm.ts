import {
  type KieliLevel,
  type KieliType,
  type MathLevel,
  type RealSubject,
  REAALIAINEET,
  YO_GRADES,
  type YoGrade,
  type YoInput,
} from "@/pages/pistelaskuri/lib/yoScoring";

interface LanguageOption {
  exam: string;
  kind: "kieli";
  label: string;
  languageKey: string;
  level: KieliLevel;
  type: KieliType;
  value: string;
}

interface MotherTongueOption {
  exam: string;
  kind: "aidinkieli";
  label: string;
  value: string;
}

interface MathOption {
  exam: string;
  kind: "matematiikka";
  label: string;
  level: MathLevel;
  value: string;
}

interface RealSubjectOption {
  exam: string;
  kind: "reaaliaine";
  label: string;
  subject: RealSubject;
  value: string;
}

type SubjectOption = MotherTongueOption | MathOption | LanguageOption | RealSubjectOption;

const LANGUAGE_OPTIONS = [
  {
    exam: "ena",
    kind: "kieli",
    label: "Englanti, pitkä",
    languageKey: "englanti",
    level: "pitkä",
    type: "vieras",
    value: "englanti-pitka",
  },
  {
    exam: "enb",
    kind: "kieli",
    label: "Englanti, lyhyt",
    languageKey: "englanti",
    level: "lyhyt",
    type: "vieras",
    value: "englanti-lyhyt",
  },
  {
    exam: "rua",
    kind: "kieli",
    label: "Toinen kotimainen kieli, pitkä",
    languageKey: "toinen-kotimainen",
    level: "pitkä",
    type: "kotimainen",
    value: "toinen-kotimainen-pitka",
  },
  {
    exam: "rub",
    kind: "kieli",
    label: "Toinen kotimainen kieli, keskipitkä",
    languageKey: "toinen-kotimainen",
    level: "keskipitkä",
    type: "kotimainen",
    value: "toinen-kotimainen-keskipitka",
  },
  {
    exam: "vea",
    kind: "kieli",
    label: "Venäjä, pitkä",
    languageKey: "venaja",
    level: "pitkä",
    type: "vieras",
    value: "venaja-pitka",
  },
  {
    exam: "veb",
    kind: "kieli",
    label: "Venäjä, lyhyt",
    languageKey: "venaja",
    level: "lyhyt",
    type: "vieras",
    value: "venaja-lyhyt",
  },
  {
    exam: "raa",
    kind: "kieli",
    label: "Ranska, pitkä",
    languageKey: "ranska",
    level: "pitkä",
    type: "vieras",
    value: "ranska-pitka",
  },
  {
    exam: "rab",
    kind: "kieli",
    label: "Ranska, lyhyt",
    languageKey: "ranska",
    level: "lyhyt",
    type: "vieras",
    value: "ranska-lyhyt",
  },
  {
    exam: "esa",
    kind: "kieli",
    label: "Espanja, pitkä",
    languageKey: "espanja",
    level: "pitkä",
    type: "vieras",
    value: "espanja-pitka",
  },
  {
    exam: "esb",
    kind: "kieli",
    label: "Espanja, lyhyt",
    languageKey: "espanja",
    level: "lyhyt",
    type: "vieras",
    value: "espanja-lyhyt",
  },
  {
    exam: "saa",
    kind: "kieli",
    label: "Saksa, pitkä",
    languageKey: "saksa",
    level: "pitkä",
    type: "vieras",
    value: "saksa-pitka",
  },
  {
    exam: "sab",
    kind: "kieli",
    label: "Saksa, lyhyt",
    languageKey: "saksa",
    level: "lyhyt",
    type: "vieras",
    value: "saksa-lyhyt",
  },
  {
    exam: "saame",
    kind: "kieli",
    label: "Saame, lyhyt",
    languageKey: "saame",
    level: "lyhyt",
    type: "vieras",
    value: "saame-lyhyt",
  },
  {
    exam: "iab",
    kind: "kieli",
    label: "Italia, lyhyt",
    languageKey: "italia",
    level: "lyhyt",
    type: "vieras",
    value: "italia-lyhyt",
  },
  {
    exam: "pob",
    kind: "kieli",
    label: "Portugali, lyhyt",
    languageKey: "portugali",
    level: "lyhyt",
    type: "vieras",
    value: "portugali-lyhyt",
  },
  {
    exam: "lab",
    kind: "kieli",
    label: "Latina, lyhyt",
    languageKey: "latina",
    level: "lyhyt",
    type: "vieras",
    value: "latina-lyhyt",
  },
] as const satisfies readonly LanguageOption[];

const MOTHER_TONGUE_OPTIONS = [
  { exam: "ai_fi", kind: "aidinkieli", label: "Suomi äidinkielenä", value: "ai_fi" },
  { exam: "ai_sv", kind: "aidinkieli", label: "Ruotsi äidinkielenä", value: "ai_sv" },
  { exam: "ai_smi", kind: "aidinkieli", label: "Saame äidinkielenä", value: "ai_smi" },
] as const satisfies readonly MotherTongueOption[];

const MATH_OPTIONS = [
  { exam: "maa", kind: "matematiikka", label: "Matematiikka, pitkä", level: "pitkä", value: "matematiikka-pitka" },
  { exam: "mab", kind: "matematiikka", label: "Matematiikka, lyhyt", level: "lyhyt", value: "matematiikka-lyhyt" },
] as const satisfies readonly MathOption[];

const REAL_SUBJECT_EXAMS = {
  Biologia: "bi",
  Elämänkatsomustieto: "et",
  "Evankelis-luterilainen uskonto": "ue",
  Filosofia: "fi",
  Fysiikka: "fy",
  Historia: "hi",
  Kemia: "ke",
  Maantiede: "ge",
  "Ortodoksinen uskonto": "uo",
  Psykologia: "ps",
  Terveystieto: "te",
  Yhteiskuntaoppi: "yh",
} as const satisfies Record<(typeof REAALIAINEET)[number], string>;

const REAL_SUBJECT_OPTIONS = REAALIAINEET.map(
  (subject) =>
    ({
      exam: REAL_SUBJECT_EXAMS[subject],
      kind: "reaaliaine",
      label: subject,
      subject,
      value: subject,
    }) as const satisfies RealSubjectOption,
);

export const SUBJECT_OPTIONS = [
  ...MOTHER_TONGUE_OPTIONS,
  ...MATH_OPTIONS,
  ...LANGUAGE_OPTIONS,
  ...REAL_SUBJECT_OPTIONS,
] as const satisfies readonly SubjectOption[];

export type YoSubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];

export interface YoAineRow {
  id: number;
  subject: YoSubjectValue | "";
  grade: YoGrade | "";
}

export interface YoFormState {
  aineet: YoAineRow[];
}

export interface YoFormErrors {
  aineet?: string;
}

export const emptyYoFormState = (): YoFormState => ({
  aineet: Array.from({ length: 5 }, (_, id) => ({ id, subject: "" as const, grade: "" as const })),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isYoGrade = (value: unknown): value is YoGrade =>
  typeof value === "string" && (YO_GRADES as string[]).includes(value);

const isYoGradeOrEmpty = (value: unknown): value is YoGrade | "" => value === "" || isYoGrade(value);

const getSubjectOption = (value: YoSubjectValue | "") => SUBJECT_OPTIONS.find((option) => option.value === value);

const isAineRow = (value: unknown): value is YoAineRow =>
  isRecord(value) &&
  Number.isInteger(value.id) &&
  (value.subject === "" || SUBJECT_OPTIONS.some((option) => option.value === value.subject)) &&
  isYoGradeOrEmpty(value.grade);

export const isYoFormState = (value: unknown): value is YoFormState => {
  if (!isRecord(value) || !Array.isArray(value.aineet) || !value.aineet.every(isAineRow)) {
    return false;
  }

  const state = value as unknown as YoFormState;
  const rowIds = state.aineet.map((row) => row.id);
  return new Set(rowIds).size === rowIds.length && "input" in parseYoForm(state);
};

const uniquenessKey = (option: SubjectOption): string => {
  if (option.kind === "aidinkieli") return "aidinkieli";
  if (option.kind === "matematiikka") return "matematiikka";
  if (option.kind === "kieli") return `kieli:${option.languageKey}`;
  return `reaaliaine:${option.subject}`;
};

export const parseYoForm = (state: YoFormState): { input: YoInput; errors?: undefined } | { errors: YoFormErrors } => {
  if (state.aineet.some((row) => !row.subject || !row.grade)) {
    return { errors: { aineet: "Täytä kaikki lisätyt aineet tai poista keskeneräinen rivi." } };
  }

  const parsed = state.aineet.map((row) => {
    const option = getSubjectOption(row.subject);
    if (!option || !row.grade) return null;
    return { grade: row.grade, option };
  });

  if (parsed.some((row) => row === null)) {
    return { errors: { aineet: "Täytä kaikki lisätyt aineet tai poista keskeneräinen rivi." } };
  }

  const rows = parsed as { grade: YoGrade; option: SubjectOption }[];
  const keys = rows.map(({ option }) => uniquenessKey(option));
  if (new Set(keys).size !== keys.length) {
    return { errors: { aineet: "Saman aineen voi lisätä vain kerran." } };
  }

  const motherTongues = rows.filter((row) => row.option.kind === "aidinkieli");
  if (motherTongues.length === 0) {
    return { errors: { aineet: "Valitse äidinkieli." } };
  }

  const math = rows.find((row) => row.option.kind === "matematiikka");
  const languages = rows.filter((row) => row.option.kind === "kieli");
  const realSubjects = rows.filter((row) => row.option.kind === "reaaliaine");

  return {
    input: {
      aidinkieli: motherTongues[0].grade,
      matematiikka:
        math && math.option.kind === "matematiikka" ? { level: math.option.level, grade: math.grade } : undefined,
      kielet: languages.flatMap(({ grade, option }) =>
        option.kind === "kieli" ? [{ grade, level: option.level, type: option.type }] : [],
      ),
      reaaliaineet: realSubjects.flatMap(({ grade, option }) =>
        option.kind === "reaaliaine" ? [{ subject: option.subject, grade }] : [],
      ),
    },
  };
};

export const toUniversityGrades = (state: YoFormState): Record<string, YoGrade> => {
  const grades: Record<string, YoGrade> = {};
  for (const row of state.aineet) {
    const option = getSubjectOption(row.subject);
    if (option && row.grade) grades[option.exam] = row.grade;
  }
  return grades;
};

export const yoFormFromExamGrades = (grades: Record<string, YoGrade>): YoFormState => ({
  aineet: Object.entries(grades).flatMap(([exam, grade], id) => {
    const option = SUBJECT_OPTIONS.find((subject) => subject.exam === exam);
    return option ? [{ id, subject: option.value, grade }] : [];
  }),
});
