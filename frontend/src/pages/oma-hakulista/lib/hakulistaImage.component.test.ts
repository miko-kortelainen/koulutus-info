import { expect, test } from "vitest";
import type { ToteutusEntry } from "@/types.gen";
import { hakulistaShareItems, hakulistaShareItemTops, wrapCanvasText } from "@/pages/oma-hakulista/lib/hakulistaImage";

const entries: ToteutusEntry[] = [
  {
    toteutusOid: "1",
    toteutusNimi: { fi: "Tietojenkäsittelytiede" },
    oppilaitosNimi: { fi: "Esimerkkikoulu" },
    kunnat: ["Helsinki"],
  },
  {
    toteutusOid: "2",
    toteutusNimi: { en: "Law" },
    oppilaitosNimi: { sv: "Åbo Akademi" },
    kunnat: ["Turku"],
  },
];

test("share image lines are school and program names in list order", () => {
  expect(hakulistaShareItems(entries)).toEqual([
    { program: "Tietojenkäsittelytiede", school: "Esimerkkikoulu" },
    { program: "Law", school: "Åbo Akademi" },
  ]);
});

test("share image keeps the first six entries and spaces items through the list area", () => {
  const extra: ToteutusEntry = {
    toteutusOid: "3",
    toteutusNimi: { fi: "Hoitotyö" },
    oppilaitosNimi: { fi: "Metropolia" },
    kunnat: ["Helsinki"],
  };
  expect(hakulistaShareItems([...entries, extra, extra, extra, extra, extra])).toHaveLength(6);
  expect(hakulistaShareItemTops([200], 100, 1100)).toEqual([500]);
  expect(hakulistaShareItemTops([100, 100, 100], 164, 1700)).toEqual([562, 882, 1202]);
  expect(hakulistaShareItemTops([240, 240], 0, 500)).toEqual([0, 312]);
});

test("wraps words to the measured width and keeps ÅÄÖ", () => {
  const measure = (value: string) => value.length;
  expect(wrapCanvasText("Åbo Akademi Äänekoski", 12, measure)).toEqual(["Åbo Akademi", "Äänekoski"]);
  expect(wrapCanvasText("Lyhyt", 80, measure)).toEqual(["Lyhyt"]);
});
