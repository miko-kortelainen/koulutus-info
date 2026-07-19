import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import type { SchoolsResponse, StatisticsResponse } from "@/types.gen";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown) => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const isNonNegativeInteger = (value: unknown) => isNumber(value) && Number.isSafeInteger(value) && value >= 0;
const isOptionalString = (value: unknown) => value === undefined || isString(value);
const isOptionalBoolean = (value: unknown) => value === undefined || typeof value === "boolean";
const isStringArray = (value: unknown) => Array.isArray(value) && value.every(isString);

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
  isNonNegativeInteger(value.ensisijaisetHakijatLkm);

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

function parseArray<T>(value: unknown, isItem: (item: unknown) => boolean, source: string): T[] {
  if (!Array.isArray(value) || !value.every(isItem)) throw new Error(`Invalid data in ${source}`);
  return value as T[];
}

export const parseStatistics = (value: unknown, source: string): StatisticsResponse =>
  parseArray(value, isStatisticsEntry, source);

export const parseSchools = (value: unknown, source: string): SchoolsResponse => parseArray(value, isSchool, source);

export const parseCutoffSchools = (value: unknown, source: string): CutoffSchool[] =>
  parseArray(value, isCutoffSchool, source);
