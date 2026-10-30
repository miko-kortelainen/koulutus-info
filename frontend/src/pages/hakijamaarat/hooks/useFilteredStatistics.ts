import Fuse from "fuse.js";
import { useMemo } from "react";
import {
  formatCount,
  formatSisaanpaasyprosentti,
  getHakijapaine,
  getSisaanpaasyprosentti,
  ratioFormat,
} from "@/lib/statistics";
import type { StatisticsEntry, StatisticsResponse } from "@/types.gen";
import { type SortOption, sortStatistics } from "@/pages/hakijamaarat/lib/sortStatistics";

const FUSE_OPTIONS = {
  keys: [{ name: "hakukohde", weight: 3 }, { name: "korkeakoulu", weight: 2 }, "sektori", "koulutusalaTaso1"],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};

function filterStatistics(
  data: StatisticsResponse | undefined,
  selectedSektorit: Set<string>,
  selectedKoulutusasteet: Set<string>,
  selectedKoulutusalat: Set<string>,
  selectedKielet: Set<string>,
  selectedKunnat: Set<string>,
  selectedSchools: Set<string>,
) {
  return (data ?? []).filter(
    (d) =>
      (!selectedSektorit.size || selectedSektorit.has(d.sektori ?? "")) &&
      (!selectedKoulutusasteet.size || selectedKoulutusasteet.has(d.koulutusasteTaso1 ?? "")) &&
      (!selectedKoulutusalat.size || selectedKoulutusalat.has(d.okmOhjauksenAla ?? "")) &&
      (!selectedKielet.size || selectedKielet.has(d.koulutuksenKieli ?? "")) &&
      (!selectedKunnat.size || selectedKunnat.has(d.kuntaHakukohde ?? "")) &&
      (!selectedSchools.size || selectedSchools.has(d.korkeakoulu ?? "")),
  );
}

export function toCompactStatistics(entry: StatisticsEntry) {
  const paine = getHakijapaine(entry);
  const sisaanpaasy = getSisaanpaasyprosentti(entry.valitutLkm, entry.kaikkiHakijatLkm);
  return {
    nimi: entry.hakukohde,
    koulu: entry.korkeakoulu,
    kunta: entry.kuntaHakukohde,
    koodi: entry.kooditHakukohde,
    kaikkiHakijat: formatCount(entry.kaikkiHakijatLkm),
    ensisijaiset: formatCount(entry.ensisijaisetHakijatLkm),
    aloituspaikat: formatCount(entry.aloituspaikatLkm),
    sisaanpaasyprosentti:
      sisaanpaasy == null ? null : formatSisaanpaasyprosentti(entry.valitutLkm, entry.kaikkiHakijatLkm),
    hakijapaine: paine == null ? null : ratioFormat.format(paine),
  };
}

export default function useFilteredStatistics(
  data: StatisticsResponse | undefined,
  searchTerm: string,
  sortOrder: SortOption,
  selectedSektorit: Set<string>,
  selectedKoulutusasteet: Set<string>,
  selectedKoulutusalat: Set<string>,
  selectedKielet: Set<string>,
  selectedKunnat: Set<string>,
  selectedSchools: Set<string>,
) {
  const byFilters = useMemo(
    () =>
      filterStatistics(
        data,
        selectedSektorit,
        selectedKoulutusasteet,
        selectedKoulutusalat,
        selectedKielet,
        selectedKunnat,
        selectedSchools,
      ),
    [
      data,
      selectedSektorit,
      selectedKoulutusasteet,
      selectedKoulutusalat,
      selectedKielet,
      selectedKunnat,
      selectedSchools,
    ],
  );
  const fuse = useMemo(() => new Fuse(byFilters, FUSE_OPTIONS), [byFilters]);
  const normalizedSearch = searchTerm.trim();
  const searchResults = useMemo(
    () => (normalizedSearch ? fuse.search(normalizedSearch).map((result) => result.item) : byFilters),
    [byFilters, fuse, normalizedSearch],
  );
  return useMemo(() => sortStatistics(searchResults, sortOrder), [searchResults, sortOrder]);
}
