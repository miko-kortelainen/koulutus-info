import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { YHTEISHAKU_ROUNDS } from "@/config/season";
import useCountdown from "./useCountdown";

test("stores application starts as absolute Finland instants", () => {
  expect(Date.parse(YHTEISHAKU_ROUNDS[0].start)).toBe(Date.UTC(2026, 0, 7, 6));
  expect(Date.parse(YHTEISHAKU_ROUNDS[2].start)).toBe(Date.UTC(2026, 7, 31, 5));
});

test("counts down to the next configured application round", () => {
  vi.useFakeTimers();
  const nextRound = YHTEISHAKU_ROUNDS[0];
  const start = new Date(nextRound.start).getTime();
  vi.setSystemTime(start - (24 * 60 + 2 * 60 + 3) * 60_000);

  const { result } = renderHook(() => useCountdown());

  expect(result.current).toEqual({ days: 1, hours: 2, minutes: 3, label: nextRound.label });

  act(() => vi.advanceTimersByTime(60_000));
  expect(result.current?.minutes).toBe(2);
});

test("returns no countdown after the final configured round", () => {
  vi.useFakeTimers();
  const finalStart = Math.max(...YHTEISHAKU_ROUNDS.map((round) => new Date(round.start).getTime()));
  vi.setSystemTime(finalStart + 1);

  const { result } = renderHook(() => useCountdown());

  expect(result.current).toBeUndefined();
});
