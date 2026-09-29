import { useEffect, useState } from "react";
import { type YhteishakuRound, nextCountdownTarget } from "@/config/season";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  label: string;
}

function computeTimeLeft(now: number, rounds: readonly YhteishakuRound[]): TimeLeft | undefined {
  const target = nextCountdownTarget(now, rounds);
  if (!target) return undefined;

  const diffMs = Date.parse(target.at) - now;
  return {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
    label: target.caption,
  };
}

export default function useCountdown(rounds: readonly YhteishakuRound[]) {
  const [now, setNow] = useState<number>();

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return now == null ? undefined : computeTimeLeft(now, rounds);
}
