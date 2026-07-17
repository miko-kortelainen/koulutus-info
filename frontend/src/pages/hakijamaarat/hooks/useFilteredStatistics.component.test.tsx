import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import type { StatisticsEntry, StatisticsResponse } from "@/types.gen";
import type { SortOption } from "../components/SortControl";
import useFilteredStatistics from "./useFilteredStatistics";

const statistics: StatisticsResponse = [
  {
    kooditHakukohde: "alpha",
    hakukohde: "Alpha",
    korkeakoulu: "Aalto-yliopisto",
    kuntaHakukohde: "Espoo",
    sektori: "Yliopistokoulutus",
    koulutusasteTaso1: "Alempi korkeakouluaste",
    okmOhjauksenAla: "Kauppa, hallinto ja oikeustieteet",
    koulutuksenKieli: "vain suomi",
    koulutusalaTaso1: "Kauppa",
    aloituspaikatLkm: 30,
    kaikkiHakijatLkm: 100,
    ensisijaisetHakijatLkm: 50,
  },
  {
    kooditHakukohde: "beta",
    hakukohde: "Beta",
    korkeakoulu: "Metropolia",
    kuntaHakukohde: "Helsinki",
    sektori: "Ammattikorkeakoulukoulutus",
    koulutusasteTaso1: "Alempi korkeakouluaste",
    okmOhjauksenAla: "Terveys- ja hyvinvointialat",
    koulutuksenKieli: "vain englanti",
    koulutusalaTaso1: "Terveys",
    aloituspaikatLkm: 10,
    kaikkiHakijatLkm: 300,
    ensisijaisetHakijatLkm: 100,
  },
  {
    kooditHakukohde: "gamma",
    hakukohde: "Gamma",
    korkeakoulu: "TAMK",
    kuntaHakukohde: "Tampere",
    sektori: "Ammattikorkeakoulukoulutus",
    koulutusasteTaso1: "Ylempi korkeakouluaste",
    okmOhjauksenAla: "Tekniikan alat",
    koulutuksenKieli: "vain suomi",
    koulutusalaTaso1: "Tekniikka",
    aloituspaikatLkm: 20,
    kaikkiHakijatLkm: 200,
    ensisijaisetHakijatLkm: 75,
  },
];

const ids = (items: StatisticsEntry[]) => items.map((item) => item.kooditHakukohde);

test("handles missing data and combines filters with trimmed search", () => {
  const { result, rerender } = renderHook(
    ({ data, searchTerm, sortOrder, sectors, degrees, fields, languages, municipalities, schools }) =>
      useFilteredStatistics(data, searchTerm, sortOrder, sectors, degrees, fields, languages, municipalities, schools),
    {
      initialProps: {
        data: undefined as StatisticsResponse | undefined,
        searchTerm: "",
        sortOrder: "asc" as SortOption,
        sectors: new Set<string>(),
        degrees: new Set<string>(),
        fields: new Set<string>(),
        languages: new Set<string>(),
        municipalities: new Set<string>(),
        schools: new Set<string>(),
      },
    },
  );

  expect(result.current).toEqual([]);

  rerender({
    data: statistics,
    searchTerm: "",
    sortOrder: "asc",
    sectors: new Set(["Ammattikorkeakoulukoulutus"]),
    degrees: new Set(["Ylempi korkeakouluaste"]),
    fields: new Set(["Tekniikan alat"]),
    languages: new Set(["vain suomi"]),
    municipalities: new Set(["Helsinki", "Tampere"]),
    schools: new Set(["TAMK"]),
  });
  expect(ids(result.current)).toEqual(["gamma"]);

  rerender({
    data: statistics,
    searchTerm: "  Metropolia  ",
    sortOrder: "asc",
    sectors: new Set(["Ammattikorkeakoulukoulutus"]),
    degrees: new Set(["Alempi korkeakouluaste"]),
    fields: new Set(["Terveys- ja hyvinvointialat"]),
    languages: new Set(["vain suomi", "vain englanti"]),
    municipalities: new Set(["Helsinki", "Tampere"]),
    schools: new Set(["Metropolia", "TAMK"]),
  });
  expect(ids(result.current)).toEqual(["beta"]);
});

test("combines the new filters with OR within groups and AND between groups", () => {
  const { result, rerender } = renderHook(
    ({ degrees, fields, languages }) =>
      useFilteredStatistics(statistics, "", "asc", new Set(), degrees, fields, languages, new Set(), new Set()),
    {
      initialProps: {
        degrees: new Set<string>(),
        fields: new Set<string>(),
        languages: new Set<string>(),
      },
    },
  );

  // empty groups do not restrict results
  expect(ids(result.current)).toEqual(["alpha", "beta", "gamma"]);

  // OR within one group: two languages match different rows
  rerender({
    degrees: new Set<string>(),
    fields: new Set<string>(),
    languages: new Set(["vain suomi", "vain englanti"]),
  });
  expect(ids(result.current)).toEqual(["alpha", "beta", "gamma"]);

  rerender({
    degrees: new Set<string>(),
    fields: new Set<string>(),
    languages: new Set(["vain englanti"]),
  });
  expect(ids(result.current)).toEqual(["beta"]);

  // AND between groups: each group matches more rows than their intersection
  rerender({
    degrees: new Set(["Ylempi korkeakouluaste"]),
    fields: new Set(["Tekniikan alat", "Terveys- ja hyvinvointialat"]),
    languages: new Set(["vain suomi", "vain englanti"]),
  });
  expect(ids(result.current)).toEqual(["gamma"]);
});

test.each<[SortOption, string[]]>([
  ["asc", ["alpha", "beta", "gamma"]],
  ["desc", ["gamma", "beta", "alpha"]],
  ["most_popular", ["beta", "gamma", "alpha"]],
  ["least_popular", ["alpha", "gamma", "beta"]],
  ["most_spots", ["alpha", "gamma", "beta"]],
  ["least_spots", ["beta", "gamma", "alpha"]],
])("sorts statistics with %s without mutating the source", (sortOrder, expected) => {
  const originalOrder = ids(statistics);
  const { result } = renderHook(() =>
    useFilteredStatistics(statistics, "", sortOrder, new Set(), new Set(), new Set(), new Set(), new Set(), new Set()),
  );

  expect(ids(result.current)).toEqual(expected);
  expect(ids(statistics)).toEqual(originalOrder);
});
