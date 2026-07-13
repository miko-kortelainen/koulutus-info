import type { KieliLevel, KieliType, MathLevel, YoGrade, YoInput } from "./yoScoring";

interface LanguageOption {
  label: string;
  languageKey: string;
  level: KieliLevel;
  type: KieliType;
  value: string;
}

export const LANGUAGE_OPTIONS = [
  { label: "Englanti, pitkä", languageKey: "englanti", level: "pitkä", type: "vieras", value: "englanti-pitka" },
  { label: "Englanti, lyhyt", languageKey: "englanti", level: "lyhyt", type: "vieras", value: "englanti-lyhyt" },
  {
    label: "Toinen kotimainen kieli, pitkä",
    languageKey: "toinen-kotimainen",
    level: "pitkä",
    type: "kotimainen",
    value: "toinen-kotimainen-pitka",
  },
  {
    label: "Toinen kotimainen kieli, keskipitkä",
    languageKey: "toinen-kotimainen",
    level: "keskipitkä",
    type: "kotimainen",
    value: "toinen-kotimainen-keskipitka",
  },
  { label: "Venäjä, pitkä", languageKey: "venaja", level: "pitkä", type: "vieras", value: "venaja-pitka" },
  { label: "Venäjä, lyhyt", languageKey: "venaja", level: "lyhyt", type: "vieras", value: "venaja-lyhyt" },
  { label: "Ranska, pitkä", languageKey: "ranska", level: "pitkä", type: "vieras", value: "ranska-pitka" },
  { label: "Ranska, lyhyt", languageKey: "ranska", level: "lyhyt", type: "vieras", value: "ranska-lyhyt" },
  { label: "Espanja, pitkä", languageKey: "espanja", level: "pitkä", type: "vieras", value: "espanja-pitka" },
  { label: "Espanja, lyhyt", languageKey: "espanja", level: "lyhyt", type: "vieras", value: "espanja-lyhyt" },
  { label: "Saksa, pitkä", languageKey: "saksa", level: "pitkä", type: "vieras", value: "saksa-pitka" },
  { label: "Saksa, lyhyt", languageKey: "saksa", level: "lyhyt", type: "vieras", value: "saksa-lyhyt" },
  { label: "Saame, lyhyt", languageKey: "saame", level: "lyhyt", type: "vieras", value: "saame-lyhyt" },
  { label: "Italia, lyhyt", languageKey: "italia", level: "lyhyt", type: "vieras", value: "italia-lyhyt" },
  { label: "Portugali, lyhyt", languageKey: "portugali", level: "lyhyt", type: "vieras", value: "portugali-lyhyt" },
  { label: "Latina, lyhyt", languageKey: "latina", level: "lyhyt", type: "vieras", value: "latina-lyhyt" },
] as const satisfies readonly LanguageOption[];

export type YoLanguageValue = (typeof LANGUAGE_OPTIONS)[number]["value"];

export interface YoKieliRow {
  id: number;
  language: YoLanguageValue | "";
  grade: YoGrade | "";
}

export interface YoReaaliaineRow {
  id: number;
  subject: string;
  grade: YoGrade | "";
}

export interface YoFormState {
  aidinkieli: YoGrade | "";
  matematiikkaLevel: MathLevel;
  matematiikkaGrade: YoGrade | "";
  kielet: YoKieliRow[];
  reaaliaineet: YoReaaliaineRow[];
}

export interface YoFormErrors {
  aidinkieli?: string;
  kielet?: string;
  reaaliaineet?: string;
}

export const emptyYoFormState = (): YoFormState => ({
  aidinkieli: "",
  matematiikkaLevel: "pitkä",
  matematiikkaGrade: "",
  kielet: [],
  reaaliaineet: [],
});

const getLanguageOption = (value: YoLanguageValue | "") => LANGUAGE_OPTIONS.find((option) => option.value === value);

export const parseYoForm = (state: YoFormState): { input: YoInput; errors?: undefined } | { errors: YoFormErrors } => {
  const errors: YoFormErrors = {};
  const parsedLanguages = state.kielet.flatMap((kieli) => {
    const option = getLanguageOption(kieli.language);
    if (!option || !kieli.grade) return [];

    return [{ grade: kieli.grade, languageKey: option.languageKey, level: option.level, type: option.type }];
  });

  if (!state.aidinkieli) errors.aidinkieli = "Valitse äidinkielen arvosana.";
  if (parsedLanguages.length !== state.kielet.length)
    errors.kielet = "Täytä kaikki lisätyt kielet tai poista keskeneräinen rivi.";
  else if (new Set(parsedLanguages.map((kieli) => kieli.languageKey)).size !== parsedLanguages.length)
    errors.kielet = "Saman kielen voi lisätä vain kerran.";
  if (state.reaaliaineet.some((reaaliaine) => !reaaliaine.subject || !reaaliaine.grade)) {
    errors.reaaliaineet = "Täytä kaikki lisätyt aineet tai poista keskeneräinen rivi.";
  } else if (new Set(state.reaaliaineet.map((reaaliaine) => reaaliaine.subject)).size !== state.reaaliaineet.length) {
    errors.reaaliaineet = "Saman reaaliaineen voi lisätä vain kerran.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    input: {
      aidinkieli: state.aidinkieli as YoGrade,
      matematiikka: state.matematiikkaGrade
        ? { level: state.matematiikkaLevel, grade: state.matematiikkaGrade }
        : undefined,
      kielet: parsedLanguages.map(({ grade, level, type }) => ({ grade, level, type })),
      reaaliaineet: state.reaaliaineet.map((reaaliaine) => ({
        subject: reaaliaine.subject,
        grade: reaaliaine.grade as YoGrade,
      })),
    },
  };
};
