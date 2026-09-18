import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { getStatistics } from "@/api/browserData";
import useSchoolStatistics from "@/pages/koulut/@slug/hooks/useSchoolStatistics";
import type { StatisticsEntry } from "@/types.gen";

vi.mock("@/api/browserData", () => ({
  getStatistics: vi.fn(),
}));

const entry = (overrides: Partial<StatisticsEntry>): StatisticsEntry => ({
  kooditHakukohde: "test",
  hakukohde: "Testikohde",
  korkeakoulu: "Testikorkeakoulu",
  aloituspaikatLkm: 20,
  kaikkiHakijatLkm: 100,
  ensisijaisetHakijatLkm: 50,
  valitutLkm: 40,
  ...overrides,
});

const autumnRows = [entry({ hakukohde: "Syksyn kohde" })];

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

test("uses prerendered rows for the initial yhteishaku without fetching", () => {
  const { result } = renderHook(() => useSchoolStatistics("Testikorkeakoulu", "2026_syksy", "2026_syksy", autumnRows), {
    wrapper: createWrapper(),
  });

  expect(result.current.rows).toEqual(autumnRows);
  expect(result.current.dataReady).toBe(true);
  expect(result.current.showLoading).toBe(false);
  expect(getStatistics).not.toHaveBeenCalled();
});

test("replaces prerendered rows after a yhteishaku switch", async () => {
  let resolveFetch: (value: StatisticsEntry[]) => void = () => {};
  vi.mocked(getStatistics).mockReturnValue(
    new Promise((resolve) => {
      resolveFetch = resolve;
    }),
  );

  const { result, rerender } = renderHook(
    ({ year }: { year: "2026_syksy" | "2026_kevat" }) =>
      useSchoolStatistics("Testikorkeakoulu", year, "2026_syksy", autumnRows),
    { initialProps: { year: "2026_syksy" }, wrapper: createWrapper() },
  );

  rerender({ year: "2026_kevat" });

  expect(result.current.showLoading).toBe(true);
  expect(result.current.dataReady).toBe(false);
  expect(result.current.rows).toEqual([]);

  resolveFetch([
    entry({ hakukohde: "Kevään kohde", kooditHakukohde: "spring", ensisijaisetHakijatLkm: 10 }),
    entry({
      hakukohde: "Toisen koulun kohde",
      kooditHakukohde: "other",
      korkeakoulu: "Toinen koulu",
      ensisijaisetHakijatLkm: 80,
    }),
    entry({ hakukohde: "Toinen kevään kohde", kooditHakukohde: "spring-2", ensisijaisetHakijatLkm: 30 }),
  ]);

  await waitFor(() => expect(result.current.dataReady).toBe(true));

  expect(result.current.rows.map((row) => row.hakukohde)).toEqual(["Toinen kevään kohde", "Kevään kohde"]);
  expect(result.current.showLoading).toBe(false);
  expect(getStatistics).toHaveBeenCalledWith("2026_kevat");
});

test("returns no rows when the selected yhteishaku has no school data", async () => {
  vi.mocked(getStatistics).mockResolvedValue([
    entry({ hakukohde: "Toisen koulun kohde", kooditHakukohde: "other", korkeakoulu: "Toinen koulu" }),
  ]);

  const { result } = renderHook(() => useSchoolStatistics("Testikorkeakoulu", "2026_kevat", "2026_syksy", autumnRows), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.dataReady).toBe(true));

  expect(result.current.rows).toEqual([]);
  expect(result.current.showError).toBe(false);
});
