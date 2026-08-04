import type { EnnakointiKoulutustarveItem, EnnakointiSektori } from "@/api/dataValidation";

const collator = new Intl.Collator("fi");

export type SektoriFilter = "kaikki" | EnnakointiSektori;

export type VajeSort = "isoin-vaje" | "pienin-vaje" | "a-o" | "o-a";

export interface VajeRow extends EnnakointiKoulutustarveItem {
  vaje: number;
}

export function statusLabel(vaje: number): "Pula" | "Ylituotos" | "Tasapaino" {
  if (vaje > 0) return "Pula";
  if (vaje < 0) return "Ylituotos";
  return "Tasapaino";
}

export function filterAndSortVajeRows(
  items: EnnakointiKoulutustarveItem[],
  search: string,
  sektori: SektoriFilter,
  sort: VajeSort,
): VajeRow[] {
  const q = search.trim().toLocaleLowerCase("fi");
  return items
    .filter((row) => {
      if (sektori !== "kaikki" && row.sektori !== sektori) return false;
      if (q && !row.ala.toLocaleLowerCase("fi").includes(q)) return false;
      return true;
    })
    .map((row) => ({ ...row, vaje: row.tarve2045 - row.tuotosNuoret }))
    .sort((a, b) => {
      switch (sort) {
        case "pienin-vaje":
          return a.vaje - b.vaje || collator.compare(a.ala, b.ala);
        case "a-o":
          return collator.compare(a.ala, b.ala);
        case "o-a":
          return collator.compare(b.ala, a.ala);
        default:
          return b.vaje - a.vaje || collator.compare(a.ala, b.ala);
      }
    });
}
