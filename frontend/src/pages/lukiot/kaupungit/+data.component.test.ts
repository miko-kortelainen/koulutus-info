import { expect, test, vi } from "vitest";
import { data } from "@/pages/lukiot/kaupungit/+data";

vi.mock("@/api/serverData", () => ({
  lukioKuntaNames: () => ["Akaa", "Helsinki"],
  readLukioKeskiarvot: () => [
    { kunta: "Akaa", koulu: "Akaan lukio" },
    { kunta: "Akaa", koulu: "Akaan lukio" },
    { kunta: "Helsinki", koulu: "Lukio 1" },
    { kunta: "Helsinki", koulu: "Lukio 2" },
  ],
}));

test("counts each school once per municipality", () => {
  expect(data()).toEqual([
    { nimi: "Akaa", lukioidenMaara: 1 },
    { nimi: "Helsinki", lukioidenMaara: 2 },
  ]);
});
