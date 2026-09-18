import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { getStatistics } from "@/api/browserData";
import type { SchoolListItem } from "@/pages/koulut/+data";
import useSchoolListStatistics from "@/pages/koulut/hooks/useSchoolListStatistics";
import type { StatisticsEntry } from "@/types.gen";

vi.mock("@/api/browserData", () => ({
  getStatistics: vi.fn(),
}));

const school = (overrides: Partial<SchoolListItem>): SchoolListItem => ({
  name: "Testikorkeakoulu",
  slug: "testikorkeakoulu",
  sektori: "Yliopistokoulutus",
  kaikkiHakijat: 10,
  valitut: 2,
  ensisijaisetHakijat: 3,
  aloituspaikat: 5,
  feedbackAverage: 4.1,
  feedbackMaxScore: 5,
  ...overrides,
});

const entry = (overrides: Partial<StatisticsEntry>): StatisticsEntry => ({
  kooditHakukohde: "a",
  hakukohde: "Kohde A",
  korkeakoulu: "Testikorkeakoulu",
  aloituspaikatLkm: 10,
  kaikkiHakijatLkm: 40,
  ensisijaisetHakijatLkm: 12,
  valitutLkm: 8,
  ...overrides,
});

const ssrSchools = [school({}), school({ name: "Toinen koulu", slug: "toinen-koulu", kaikkiHakijat: 99 })];

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

test("uses prerendered school totals for the current yhteishaku without fetching", () => {
  const { result } = renderHook(() => useSchoolListStatistics(ssrSchools), { wrapper: createWrapper() });

  expect(result.current.yearSchools).toEqual(ssrSchools);
  expect(result.current.dataReady).toBe(true);
  expect(result.current.showLoading).toBe(false);
  expect(getStatistics).not.toHaveBeenCalled();
});

test("replaces prerendered totals after a yhteishaku switch", async () => {
  let resolveFetch: (value: StatisticsEntry[]) => void = () => {};
  vi.mocked(getStatistics).mockReturnValue(
    new Promise((resolve) => {
      resolveFetch = resolve;
    }),
  );

  const { result } = renderHook(() => useSchoolListStatistics(ssrSchools), { wrapper: createWrapper() });

  act(() => {
    result.current.setSelectedYear("2026_kevat");
  });

  await waitFor(() => expect(result.current.showLoading).toBe(true));
  expect(result.current.dataReady).toBe(false);
  expect(result.current.yearSchools).toEqual([]);

  resolveFetch([
    entry({ kaikkiHakijatLkm: 23476, ensisijaisetHakijatLkm: 9742, valitutLkm: 2647, aloituspaikatLkm: 2115 }),
  ]);

  await waitFor(() => expect(result.current.dataReady).toBe(true));

  expect(result.current.yearSchools[0]).toMatchObject({
    name: "Testikorkeakoulu",
    feedbackAverage: 4.1,
    kaikkiHakijat: 23476,
    ensisijaisetHakijat: 9742,
  });
  expect(result.current.yearSchools[1]).toMatchObject({
    name: "Toinen koulu",
    kaikkiHakijat: null,
    ensisijaisetHakijat: null,
  });
  expect(result.current.showLoading).toBe(false);
  expect(getStatistics).toHaveBeenCalledWith("2026_kevat");
});
