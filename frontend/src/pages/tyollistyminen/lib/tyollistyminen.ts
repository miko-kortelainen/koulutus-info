import type {
  AmmattiPalkkaItem,
  KoulutusalaPalkkaItem,
  TyollistyminenBreakdown,
  TyollistyminenItem,
} from "@/api/dataValidation";

export type FieldSort = "a-o" | "o-a" | "tyollisyys" | "palkka";
export type OccupationSort = "palkka-desc" | "palkka-asc" | "a-o" | "o-a";

export interface MergedFieldRow {
  ala: string;
  employment: TyollistyminenItem;
  salary: KoulutusalaPalkkaItem | null;
  occupations: AmmattiPalkkaItem[];
}

const CURATED_OCCUPATION_CODES: Record<string, readonly string[]> = {
  Kasvatusalat: ["1345", "23301", "23302", "2320", "2352", "23411", "23591", "2342"],
  "Humanistiset ja taidealat": ["26421", "26422", "2654", "2163", "3431", "2166", "2643", "2622"],
  "Yhteiskunnalliset alat": ["2631", "2634", "26351", "2636", "2632", "2633", "34121", "34122"],
  "Kauppa, hallinto ja oikeustieteet": ["1120", "1211", "2611", "2413", "2411", "2431", "2423", "3313"],
  Luonnontieteet: ["2120", "2133", "2113", "2131", "2111", "3141"],
  "Tietojenkäsittely ja tietoliikenne": ["1330", "2511", "2523", "2519", "2512", "2513", "2514", "3512"],
  "Tekniikan alat": ["2145", "2152", "2141", "2142", "2151", "2144", "2161", "7411"],
  "Maa- ja metsätalousalat": ["2250", "21321", "21322", "3143", "3142", "6210", "61131", "6111"],
  "Terveys- ja hyvinvointialat": ["22121", "2211", "2261", "2262", "3258", "32211", "5321", "3255"],
  Palvelualat: ["3153", "1411", "5411", "8332", "3434", "5414", "51201", "5141"],
};

/** Combined employment share (full-time employed + employed students) 3 years after graduation. */
export function totalEmployed(breakdown: TyollistyminenBreakdown | null): number | null {
  if (!breakdown) return null;
  const { paatoimisetTyolliset, tyollisetOpiskelijat } = breakdown;
  if (paatoimisetTyolliset === null || tyollisetOpiskelijat === null) return null;
  return paatoimisetTyolliset + tyollisetOpiskelijat;
}

/** Unweighted mean of available degree-level total employment rates for a study field. */
export function averageEmployment(item: TyollistyminenItem): number | null {
  const values = [item.amk, item.yamk, item.alempi, item.ylempi]
    .map(totalEmployed)
    .filter((value): value is number => value !== null);
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

/** Minimum and maximum available median monthly salary across education levels for a field. */
export function salaryRange(salary: KoulutusalaPalkkaItem | null): { min: number; max: number } | null {
  if (!salary) return null;
  const values = [salary.toinenAste, salary.alempiKorkeakoulu, salary.ylempiKorkeakoulu].filter(
    (value): value is number => value !== null,
  );
  if (values.length === 0) return null;
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Joins employment, field-level salary, and curated occupation examples by study field. */
export function mergeFieldRows(
  employmentItems: TyollistyminenItem[],
  salaryItems: KoulutusalaPalkkaItem[],
  occupationItems: AmmattiPalkkaItem[],
): MergedFieldRow[] {
  const salaryByAla = new Map(salaryItems.map((item) => [item.ala, item]));
  const occupationByCode = new Map(occupationItems.map((item) => [item.koodi, item]));

  return employmentItems.map((employment) => {
    const codes = CURATED_OCCUPATION_CODES[employment.ala] ?? [];
    const occupations = codes
      .map((code) => occupationByCode.get(code))
      .filter((item): item is AmmattiPalkkaItem => item !== undefined)
      .sort((a, b) => b.mediaaniPalkka - a.mediaaniPalkka);

    return {
      ala: employment.ala,
      employment,
      salary: salaryByAla.get(employment.ala) ?? null,
      occupations,
    };
  });
}

function fieldSalaryScore(salary: KoulutusalaPalkkaItem | null): number {
  if (!salary) return -1;
  return salary.ylempiKorkeakoulu ?? salary.alempiKorkeakoulu ?? salary.toinenAste ?? -1;
}

/** Filters (when searching) and sorts merged study field rows. */
export function filterAndSortFieldRows(rows: MergedFieldRow[], search: string, sort: FieldSort): MergedFieldRow[] {
  const query = search.trim().toLocaleLowerCase("fi");
  const filtered = query
    ? rows.filter(
        (row) =>
          row.ala.toLocaleLowerCase("fi").includes(query) ||
          row.occupations.some((occupation) => occupation.nimi.toLocaleLowerCase("fi").includes(query)),
      )
    : rows;

  return [...filtered].sort((a, b) => {
    if (sort === "a-o") return a.ala.localeCompare(b.ala, "fi");
    if (sort === "o-a") return b.ala.localeCompare(a.ala, "fi");
    if (sort === "tyollisyys") {
      const diff = (averageEmployment(b.employment) ?? -1) - (averageEmployment(a.employment) ?? -1);
      return diff !== 0 ? diff : a.ala.localeCompare(b.ala, "fi");
    }
    const diff = fieldSalaryScore(b.salary) - fieldSalaryScore(a.salary);
    return diff !== 0 ? diff : a.ala.localeCompare(b.ala, "fi");
  });
}

/** Returns sorted unique major occupation groups (`paaryhma`) for non-group occupations. */
export function getOccupationGroups(items: AmmattiPalkkaItem[]): string[] {
  const groups = new Set<string>();
  for (const item of items) {
    if (!item.onRyhma) groups.add(item.paaryhma);
  }
  return [...groups].sort((a, b) => a.localeCompare(b, "fi"));
}

/** Filters and sorts specific occupations (excluding group summaries). */
export function filterAndSortOccupations(
  items: AmmattiPalkkaItem[],
  search: string,
  paaryhma: string,
  sort: OccupationSort,
): AmmattiPalkkaItem[] {
  const query = search.trim().toLocaleLowerCase("fi");
  const filtered = items.filter((item) => {
    if (item.onRyhma) return false;
    if (paaryhma !== "kaikki" && item.paaryhma !== paaryhma) return false;
    if (query && !item.nimi.toLocaleLowerCase("fi").includes(query)) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "palkka-desc") return b.mediaaniPalkka - a.mediaaniPalkka || a.nimi.localeCompare(b.nimi, "fi");
    if (sort === "palkka-asc") return a.mediaaniPalkka - b.mediaaniPalkka || a.nimi.localeCompare(b.nimi, "fi");
    if (sort === "a-o") return a.nimi.localeCompare(b.nimi, "fi");
    return b.nimi.localeCompare(a.nimi, "fi");
  });
}

/** Searches specific occupations across all fields, ordered by highest salary first. */
export function searchOccupations(items: AmmattiPalkkaItem[], search: string): AmmattiPalkkaItem[] {
  if (!search.trim()) return [];
  return filterAndSortOccupations(items, search, "kaikki", "palkka-desc");
}
