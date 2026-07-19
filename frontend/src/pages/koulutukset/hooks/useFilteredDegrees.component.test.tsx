import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import useFilteredDegrees from "./useFilteredDegrees";

const degrees = [
  {
    toteutusOid: "yo-law",
    toteutusNimi: { fi: "Oikeustiede", en: "Law" },
    oppilaitosNimi: { fi: "Turun yliopisto", en: "University of Turku" },
    kunnat: ["Turku"],
    sektori: "yo",
    tutkintotaso: "alempi",
  },
  {
    toteutusOid: "amk-design",
    toteutusNimi: { fi: "Muotoilu" },
    oppilaitosNimi: { fi: "Metropolia" },
    kunnat: ["Helsinki"],
    sektori: "amk",
    tutkintotaso: "alempi",
  },
  {
    toteutusOid: "amk-engineering",
    toteutusNimi: { fi: "Insinööri" },
    oppilaitosNimi: { fi: "TAMK" },
    kunnat: ["Tampere"],
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

test("combines filter groups including koulutusaste", () => {
  const { result, rerender } = renderHook(
    ({ data, sectors, municipalities, schools, tasot }) =>
      useFilteredDegrees(data, "", sectors, municipalities, schools, tasot),
    {
      initialProps: {
        data: degrees as typeof degrees | undefined,
        sectors: new Set<string>(),
        municipalities: new Set<string>(),
        schools: new Set<string>(),
        tasot: new Set<string>(),
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
  });
  expect(ids(result.current)).toEqual(["amk-design", "amk-engineering"]);

  rerender({
    data: degrees,
    sectors: new Set<string>(),
    municipalities: new Set<string>(),
    schools: new Set<string>(),
    tasot: new Set(["ylempi"]),
  });
  expect(ids(result.current)).toEqual(["amk-master"]);

  rerender({
    data: undefined,
    sectors: new Set<string>(),
    municipalities: new Set<string>(),
    schools: new Set<string>(),
    tasot: new Set<string>(),
  });
  expect(result.current).toEqual([]);
});

test("trims search terms and searches translated names", () => {
  const { result } = renderHook(() =>
    useFilteredDegrees(degrees, "  Law  ", new Set(), new Set(), new Set(), new Set()),
  );

  expect(ids(result.current)).toEqual(["yo-law"]);
});
