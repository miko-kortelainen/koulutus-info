import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import type { SchoolsResponse, StatisticsResponse } from "@/types.gen";

export interface FeedbackStatistics {
  vastaajatLkm: number | null;
  keskiarvo: number | null;
  keskihajonta: number | null;
  salattu?: boolean;
}

export interface FeedbackItem {
  kohde: string;
  tilastot: FeedbackStatistics;
}

export interface FeedbackGroup {
  tilastot: FeedbackStatistics;
  kohteet: FeedbackItem[];
}

export type FeedbackSection = FeedbackGroup | { tasot: Record<string, FeedbackGroup> };

export interface FeedbackField {
  tilastot: FeedbackStatistics;
  osiot: Record<string, FeedbackSection>;
}

export interface StudentFeedback {
  tilastot: FeedbackStatistics;
  koulutusalat: Record<string, FeedbackField>;
}

export type FeedbackMaxScore = 5 | 7;

export type StudentFeedbackDataset = Record<string, StudentFeedback>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown) => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const isNonNegativeInteger = (value: unknown) => isNumber(value) && Number.isSafeInteger(value) && value >= 0;
const isNullableNumber = (value: unknown) => value === null || (isNumber(value) && value >= 0);
const isNullableAverage = (value: unknown, maxScore: FeedbackMaxScore) =>
  value === null || (isNumber(value) && value >= 1 && value <= maxScore);
const isNullableCount = (value: unknown) => value === null || isNonNegativeInteger(value);
const isOptionalString = (value: unknown) => value === undefined || isString(value);
const isOptionalBoolean = (value: unknown) => value === undefined || typeof value === "boolean";
const isStringArray = (value: unknown) => Array.isArray(value) && value.every(isString);
const isRecordOf = (value: unknown, isValue: (item: unknown) => boolean) =>
  isRecord(value) && Object.keys(value).every(Boolean) && Object.values(value).every(isValue);

const isLanguageStrings = (value: unknown) =>
  isRecord(value) && isOptionalString(value.fi) && isOptionalString(value.sv) && isOptionalString(value.en);

const isStatisticsEntry = (value: unknown) =>
  isRecord(value) &&
  isString(value.kooditHakukohde) &&
  isString(value.hakukohde) &&
  [
    value.korkeakoulu,
    value.kuntaHakukohde,
    value.maakuntaHakukohde,
    value.koulutuksenKieli,
    value.sektori,
    value.koulutusasteTaso1,
    value.koulutusalaTaso1,
    value.okmOhjauksenAla,
  ].every(isOptionalString) &&
  isNonNegativeInteger(value.aloituspaikatLkm) &&
  isNonNegativeInteger(value.kaikkiHakijatLkm) &&
  isNonNegativeInteger(value.ensisijaisetHakijatLkm) &&
  isNonNegativeInteger(value.valitutLkm);

const isToteutus = (value: unknown) =>
  isRecord(value) &&
  isString(value.toteutusOid) &&
  isLanguageStrings(value.toteutusNimi) &&
  isLanguageStrings(value.oppilaitosNimi) &&
  isStringArray(value.kunnat) &&
  isStringArray(value.koulutusalat) &&
  isOptionalBoolean(value.muuntokoulutus);

const isSchool = (value: unknown) =>
  isRecord(value) &&
  isLanguageStrings(value.nimi) &&
  isString(value.sektori) &&
  isString(value.tutkintotaso) &&
  Array.isArray(value.toteutukset) &&
  value.toteutukset.every(isToteutus);

const isCutoff = (value: unknown) =>
  isRecord(value) &&
  isString(value.selectionMethod) &&
  isNumber(value.score) &&
  isNonNegativeInteger(value.startYear) &&
  isString(value.startSeason);

const isCutoffProgramme = (value: unknown) =>
  isRecord(value) &&
  isString(value.name) &&
  isString(value.koulutusala) &&
  Array.isArray(value.cutoffs) &&
  value.cutoffs.every(isCutoff);

const isCutoffSchool = (value: unknown) =>
  isRecord(value) &&
  isString(value.name) &&
  isString(value.sector) &&
  Array.isArray(value.programmes) &&
  value.programmes.every(isCutoffProgramme);

const isFeedbackStatistics = (value: unknown, maxScore: FeedbackMaxScore) =>
  isRecord(value) &&
  isNullableCount(value.vastaajatLkm) &&
  isNullableAverage(value.keskiarvo, maxScore) &&
  isNullableNumber(value.keskihajonta) &&
  isOptionalBoolean(value.salattu) &&
  (value.salattu !== true || (value.vastaajatLkm === null && value.keskiarvo === null && value.keskihajonta === null));

const isFeedbackItem = (value: unknown, maxScore: FeedbackMaxScore) =>
  isRecord(value) && isString(value.kohde) && value.kohde !== "" && isFeedbackStatistics(value.tilastot, maxScore);

const isFeedbackGroup = (value: unknown, maxScore: FeedbackMaxScore) =>
  isRecord(value) &&
  isFeedbackStatistics(value.tilastot, maxScore) &&
  Array.isArray(value.kohteet) &&
  value.kohteet.every((item) => isFeedbackItem(item, maxScore));

const isFeedbackSection = (value: unknown, maxScore: FeedbackMaxScore) =>
  isRecord(value) &&
  ((value.tasot === undefined && isFeedbackGroup(value, maxScore)) ||
    (value.tilastot === undefined &&
      value.kohteet === undefined &&
      isRecordOf(value.tasot, (group) => isFeedbackGroup(group, maxScore))));

const isFeedbackField = (value: unknown, maxScore: FeedbackMaxScore) =>
  isRecord(value) &&
  isFeedbackStatistics(value.tilastot, maxScore) &&
  isRecordOf(value.osiot, (section) => isFeedbackSection(section, maxScore));

const isStudentFeedback = (value: unknown, maxScore: FeedbackMaxScore) =>
  isRecord(value) &&
  isFeedbackStatistics(value.tilastot, maxScore) &&
  isRecordOf(value.koulutusalat, (field) => isFeedbackField(field, maxScore));

function parseArray<T>(value: unknown, isItem: (item: unknown) => boolean, source: string): T[] {
  if (!Array.isArray(value) || !value.every(isItem)) throw new Error(`Invalid data in ${source}`);
  return value as T[];
}

export const parseStatistics = (value: unknown, source: string): StatisticsResponse =>
  parseArray(value, isStatisticsEntry, source);

export const parseSchools = (value: unknown, source: string): SchoolsResponse => parseArray(value, isSchool, source);

export const parseCutoffSchools = (value: unknown, source: string): CutoffSchool[] =>
  parseArray(value, isCutoffSchool, source);

export const parseStudentFeedback = (
  value: unknown,
  source: string,
  maxScore: FeedbackMaxScore,
): StudentFeedbackDataset => {
  if (!isRecordOf(value, (feedback) => isStudentFeedback(feedback, maxScore))) {
    throw new Error(`Invalid data in ${source}`);
  }
  return value as StudentFeedbackDataset;
};
