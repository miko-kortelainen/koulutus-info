import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import useFilteredDegrees from "@/pages/koulutukset/hooks/useFilteredDegrees";

const degrees = [
  {
    toteutusOid: "yo-law",
    toteutusNimi: { fi: "Oikeustiede", en: "Law" },
    oppilaitosNimi: { fi: "Turun yliopisto", en: "University of Turku" },
    kunnat: ["Turku"],
    koulutusalat: ["Kauppa, hallinto ja oikeustieteet"],
    sektori: "yo",
    tutkintotaso: "alempi",
  },
  {
    toteutusOid: "amk-design",
    toteutusNimi: { fi: "Muotoilu" },
    oppilaitosNimi: { fi: "Metropolia" },
    kunnat: ["Helsinki"],
    koulutusalat: ["Taiteet ja kulttuurialat"],
    sektori: "amk",
    tutkintotaso: "alempi",
  },
  {
    toteutusOid: "amk-engineering",
    toteutusNimi: { fi: "Insinööri" },
    oppilaitosNimi: { fi: "TAMK" },
    kunnat: ["Tampere"],
    koulutusalat: ["Tekniikan alat"],
    sektori: "amk",
    tutkintotaso: "alempi",
  },
  {
    toteutusOid: "amk-master",
    toteutusNimi: { fi: "Teknologiaosaamisen johtaminen" },
    oppilaitosNimi: { fi: "TAMK" },
    kunnat: ["Tampere"],
    sektori: "amk",
    tutkintotaso: "ylempi",
  },
];

const ids = (items: { toteutusOid: string }[]) => items.map((item) => item.toteutusOid);
const none = () => new Set<string>();

test("combines filter groups including koulutusala", () => {
  const { result, rerender } = renderHook(
    ({ data, sectors, municipalities, schools, tasot, alat }) =>
      useFilteredDegrees(data, "", sectors, municipalities, schools, tasot, alat),
    {
      initialProps: {
        data: degrees as typeof degrees | undefined,
        sectors: none(),
        municipalities: none(),
        schools: none(),
        tasot: none(),
        alat: none(),
      },
    },
  );

  expect(ids(result.current)).toEqual(["yo-law", "amk-design", "amk-engineering", "amk-master"]);

  rerender({
    data: degrees,
    sectors: new Set(["amk"]),
    municipalities: new Set(["Helsinki", "Tampere"]),
    schools: new Set(["Metropolia", "TAMK"]),
    tasot: new Set(["alempi"]),
    alat: new Set(["Taiteet ja kulttuurialat", "Tekniikan alat"]),
  });
  expect(ids(result.current)).toEqual(["amk-design", "amk-engineering"]);

  rerender({
    data: degrees,
    sectors: none(),
    municipalities: none(),
    schools: none(),
    tasot: none(),
    alat: new Set(["Tekniikan alat"]),
  });
  expect(ids(result.current)).toEqual(["amk-engineering"]);

  rerender({
    data: undefined,
    sectors: none(),
    municipalities: none(),
    schools: none(),
    tasot: none(),
    alat: none(),
  });
  expect(result.current).toEqual([]);
});

test("searches filtered degrees and updates when the search, filters or data change", () => {
  const empty = none();
  const { result, rerender } = renderHook(
    ({ data, search, sectors }) => useFilteredDegrees(data, search, sectors, empty, empty, empty, empty),
    { initialProps: { data: degrees, search: "  Law  ", sectors: empty } },
  );

  expect(ids(result.current)).toEqual(["yo-law"]);
  rerender({ data: degrees, search: "TAMK", sectors: empty });
  expect(ids(result.current)).toEqual(["amk-engineering", "amk-master"]);
  rerender({ data: degrees, search: "TAMK", sectors: new Set(["yo"]) });
  expect(ids(result.current)).toEqual([]);
  rerender({ data: degrees, search: " ", sectors: empty });
  expect(ids(result.current)).toEqual(["yo-law", "amk-design", "amk-engineering", "amk-master"]);
  rerender({ data: degrees.slice(0, 1), search: "TAMK", sectors: empty });
  expect(ids(result.current)).toEqual([]);
});
