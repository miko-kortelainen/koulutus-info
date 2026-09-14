import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { YHTEISHAKU_ROUNDS } from "@/config/season";
import useCountdown from "@/pages/index/hooks/useCountdown";

test("stores application starts as absolute Finland instants", () => {
  expect(Date.parse(YHTEISHAKU_ROUNDS[0].start)).toBe(Date.UTC(2027, 0, 7, 6));
  expect(Date.parse(YHTEISHAKU_ROUNDS[0].end)).toBe(Date.UTC(2027, 0, 21, 13));
  expect(Date.parse(YHTEISHAKU_ROUNDS[2].start)).toBe(Date.UTC(2027, 7, 30, 5));
});

test("counts down to the next configured application start", () => {
  vi.useFakeTimers();
  const nextRound = YHTEISHAKU_ROUNDS[0];
  const start = Date.parse(nextRound.start);
  vi.setSystemTime(start - (24 * 60 + 2 * 60 + 3) * 60_000);

  const { result } = renderHook(() => useCountdown());

  expect(result.current).toEqual({
    days: 1,
    hours: 2,
    minutes: 3,
    label: "Kevään 2027 ensimmäiseen yhteishakuun",
  });

  act(() => vi.advanceTimersByTime(60_000));
  expect(result.current?.minutes).toBe(2);
});

test("counts down to the current application end after it has opened", () => {
  vi.useFakeTimers();
  const round = YHTEISHAKU_ROUNDS[0];
  vi.setSystemTime(Date.parse(round.start) + 60_000);

  const { result } = renderHook(() => useCountdown());

  expect(result.current?.label).toBe(`${round.title} päättyy`);
});

test("moves to the next round after the current application ends", () => {
  vi.useFakeTimers();
  const first = YHTEISHAKU_ROUNDS[0];
  vi.setSystemTime(Date.parse(first.end) + 1);

  const { result } = renderHook(() => useCountdown());

  expect(result.current?.label).toBe("Kevään 2027 toiseen yhteishakuun");
});

test("returns no countdown after the final configured round", () => {
  vi.useFakeTimers();
  const finalEnd = Math.max(...YHTEISHAKU_ROUNDS.map((round) => Date.parse(round.end)));
  vi.setSystemTime(finalEnd + 1);

  const { result } = renderHook(() => useCountdown());

  expect(result.current).toBeUndefined();
});
