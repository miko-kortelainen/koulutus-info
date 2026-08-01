import { CALCULATOR_API_TIMEOUT_MS, CALCULATOR_API_URL } from "@/config/calculatorApi";
import type { CutoffRound } from "@/config/cutoffRounds";

export type UniversityGrade = "I" | "A" | "B" | "C" | "M" | "E" | "L";

export interface CalculatorCutoff {
  score: number;
  selectionMethod: string;
  startSeason: string;
  startYear: number;
}

export interface UniversityProgram {
  cutoffs: CalculatorCutoff[];
  eligible: boolean;
  field: string;
  kynnysehtoLabel?: string;
  kynnysehtoPassed?: boolean;
  program: string;
  requiresRouteSelection: boolean;
  score?: number;
  university: string;
}

export interface UniversityProgramsResponse {
  applicationRound: CutoffRound;
  programs: UniversityProgram[];
}

export interface AmkSchool {
  name: string;
  programmes: {
    cutoffs: CalculatorCutoff[];
    koulutusala: string;
    name: string;
  }[];
  sector: string;
}

export interface AmkProgramsResponse {
  applicationRound: CutoffRound;
  ammattikorkeakoulut: AmkSchool[];
  maximumScore: number;
  score?: number;
}

export interface AmkAmmGrades {
  communication: number;
  gradeScale: 3 | 5;
  mathematicsSciences: number;
  societyWork: number;
  weightedAverage: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseRound = (value: unknown, path: string): CutoffRound => {
  if (typeof value !== "string" || !/^\d{4}-(kevat|syksy)$/.test(value)) {
    throw new Error(`Virheellinen pistelaskurin vastaus: ${path}.`);
  }
  return value as CutoffRound;
};

const parseCutoff = (value: unknown, path: string): CalculatorCutoff => {
  if (
    !isRecord(value) ||
    typeof value.selectionMethod !== "string" ||
    typeof value.score !== "number" ||
    !Number.isFinite(value.score) ||
    typeof value.startYear !== "number" ||
    !Number.isInteger(value.startYear) ||
    typeof value.startSeason !== "string"
  ) {
    throw new Error(`Virheellinen pistelaskurin vastaus: ${path}.`);
  }

  return {
    score: value.score,
    selectionMethod: value.selectionMethod,
    startSeason: value.startSeason,
    startYear: value.startYear,
  };
};

const parseCutoffs = (value: unknown, path: string) => {
  if (!Array.isArray(value)) throw new Error(`Virheellinen pistelaskurin vastaus: ${path}.`);
  return value.map((cutoff, index) => parseCutoff(cutoff, `${path}[${index}]`));
};

const parseUniversityProgram = (value: unknown, index: number, requireScore: boolean): UniversityProgram => {
  if (
    !isRecord(value) ||
    typeof value.university !== "string" ||
    typeof value.program !== "string" ||
    typeof value.field !== "string" ||
    typeof value.eligible !== "boolean"
  ) {
    throw new Error(`Virheellinen pistelaskurin vastaus: programs[${index}].`);
  }

  const requiresRouteSelection = value.requiresRouteSelection === true;
  const score = typeof value.score === "number" && Number.isFinite(value.score) ? value.score : undefined;
  const kynnysehto = isRecord(value.kynnysehto) ? value.kynnysehto : undefined;
  if (requireScore && value.eligible && !requiresRouteSelection && score === undefined) {
    throw new Error(`Virheellinen pistelaskurin vastaus: programs[${index}].score.`);
  }

  return {
    cutoffs: parseCutoffs(value.cutoffs, `programs[${index}].cutoffs`),
    eligible: value.eligible,
    field: value.field,
    kynnysehtoLabel: typeof kynnysehto?.label === "string" ? kynnysehto.label : undefined,
    kynnysehtoPassed: typeof kynnysehto?.passed === "boolean" ? kynnysehto.passed : undefined,
    program: value.program,
    requiresRouteSelection,
    score,
    university: value.university,
  };
};

export const parseUniversityResponse = (value: unknown, requireScores: boolean): UniversityProgramsResponse => {
  if (!isRecord(value) || !Array.isArray(value.programs)) {
    throw new Error("Virheellinen pistelaskurin vastaus: programs.");
  }
  return {
    applicationRound: parseRound(value.applicationRound, "applicationRound"),
    programs: value.programs.map((program, index) => parseUniversityProgram(program, index, requireScores)),
  };
};

const parseAmkSchool = (value: unknown, index: number): AmkSchool => {
  if (
    !isRecord(value) ||
    typeof value.name !== "string" ||
    typeof value.sector !== "string" ||
    !Array.isArray(value.programmes)
  ) {
    throw new Error(`Virheellinen pistelaskurin vastaus: ammattikorkeakoulut[${index}].`);
  }

  return {
    name: value.name,
    programmes: value.programmes.map((programme, programmeIndex) => {
      if (!isRecord(programme) || typeof programme.name !== "string" || typeof programme.koulutusala !== "string") {
        throw new Error(
          `Virheellinen pistelaskurin vastaus: ammattikorkeakoulut[${index}].programmes[${programmeIndex}].`,
        );
      }
      return {
        cutoffs: parseCutoffs(programme.cutoffs, `ammattikorkeakoulut[${index}].programmes[${programmeIndex}].cutoffs`),
        koulutusala: programme.koulutusala,
        name: programme.name,
      };
    }),
    sector: value.sector,
  };
};

export const parseAmkResponse = (value: unknown, requireScore: boolean): AmkProgramsResponse => {
  if (
    !isRecord(value) ||
    !Array.isArray(value.ammattikorkeakoulut) ||
    typeof value.maximumScore !== "number" ||
    !Number.isFinite(value.maximumScore)
  ) {
    throw new Error("Virheellinen pistelaskurin vastaus: ammattikorkeakoulut.");
  }
  const score = typeof value.score === "number" && Number.isFinite(value.score) ? value.score : undefined;
  if (requireScore && score === undefined) throw new Error("Virheellinen pistelaskurin vastaus: score.");

  return {
    applicationRound: parseRound(value.applicationRound, "applicationRound"),
    ammattikorkeakoulut: value.ammattikorkeakoulut.map(parseAmkSchool),
    maximumScore: value.maximumScore,
    score,
  };
};

export const readResponse = async <T>(responsePromise: Promise<Response>, parse: (value: unknown) => T): Promise<T> => {
  try {
    const response = await responsePromise;
    const body: unknown = await response.json().catch(() => undefined);
    if (!response.ok) {
      const message =
        isRecord(body) && isRecord(body.error) && typeof body.error.message === "string"
          ? body.error.message
          : "Pistelaskurin pyyntö epäonnistui.";
      throw new Error(message);
    }
    return parse(body);
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("Pistelaskurin pyyntö aikakatkaistiin.");
    }
    throw error;
  }
};

const fetchWithTimeout = (path: string, init?: RequestInit) =>
  fetch(`${CALCULATOR_API_URL}${path}`, { ...init, signal: AbortSignal.timeout(CALCULATOR_API_TIMEOUT_MS) });

const post = (path: string, grades: unknown) =>
  fetchWithTimeout(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grades }),
  });

export const getUniversityPrograms = () =>
  readResponse(fetchWithTimeout("/programs"), (value) => parseUniversityResponse(value, false));

export const getAmkPrograms = (method: "yo" | "amm") =>
  readResponse(fetchWithTimeout(`/amk/programs/${method}`), (value) => parseAmkResponse(value, false));

export const calculateUniversityYo = (grades: Record<string, UniversityGrade>) =>
  readResponse(post("/calculate", grades), (value) => parseUniversityResponse(value, true));

export const calculateAmkYo = (grades: Record<string, UniversityGrade>) =>
  readResponse(post("/amk/calculate/yo", grades), (value) => parseAmkResponse(value, true));

export const calculateAmkAmm = (grades: AmkAmmGrades) =>
  readResponse(post("/amk/calculate/amm", grades), (value) => parseAmkResponse(value, true));