import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import useFilteredDegrees from "./useFilteredDegrees";

const degrees = [
  {
    toteutusOid: "yo-law",
    toteutusNimi: { fi: "Oikeustiede", en: "Law" },
    oppilaitosNimi: { fi: "Turun yliopisto", en: "University of Turku" },
    kunnat: ["Turku"],
    koulutustyyppi: "yo",
    ylempiAmk: false,
  },
  {
    toteutusOid: "amk-design",
    toteutusNimi: { fi: "Muotoilu" },
    oppilaitosNimi: { fi: "Metropolia" },
    kunnat: ["Helsinki"],
    koulutustyyppi: "amk",
    ylempiAmk: false,
  },
  {
    toteutusOid: "amk-engineering",
    toteutusNimi: { fi: "Insinööri" },
    oppilaitosNimi: { fi: "TAMK" },
    kunnat: ["Tampere"],
    koulutustyyppi: "amk",
    ylempiAmk: false,
  },
  {
    toteutusOid: "amk-master",
    toteutusNimi: { fi: "Teknologiaosaamisen johtaminen" },
    oppilaitosNimi: { fi: "TAMK" },
    kunnat: ["Tampere"],
    koulutustyyppi: "amk",
    ylempiAmk: true,
  },
];

const ids = (items: { toteutusOid: string }[]) => items.map((item) => item.toteutusOid);

test("combines filter groups and hides upper AMK degrees by default", () => {
  const { result, rerender } = renderHook(
    ({ data, sectors, municipalities, schools, showUpper }) =>
      useFilteredDegrees(data, "", sectors, municipalities, schools, showUpper),
    {
      initialProps: {
        data: degrees as typeof degrees | undefined,
        sectors: new Set<string>(),
        municipalities: new Set<string>(),
        schools: new Set<string>(),
        showUpper: false,
      },
    },
  );

  expect(ids(result.current)).toEqual(["yo-law", "amk-design", "amk-engineering"]);

  rerender({
    data: degrees,
    sectors: new Set(["amk"]),
    municipalities: new Set(["Helsinki", "Tampere"]),
    schools: new Set(["Metropolia", "TAMK"]),
    showUpper: true,
  });
  expect(ids(result.current)).toEqual(["amk-design", "amk-engineering", "amk-master"]);

  rerender({
    data: undefined,
    sectors: new Set<string>(),
    municipalities: new Set<string>(),
    schools: new Set<string>(),
    showUpper: false,
  });
  expect(result.current).toEqual([]);
});

test("trims search terms and searches translated names", () => {
  const { result } = renderHook(() => useFilteredDegrees(degrees, "  Law  ", new Set(), new Set(), new Set(), false));

  expect(ids(result.current)).toEqual(["yo-law"]);
});
