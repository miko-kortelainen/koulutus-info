import { useEffect, useState } from "react";
import { YHTEISHAKU_ROUNDS } from "@/config/season";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  label: string;
}

function computeTimeLeft(): TimeLeft | undefined {
  const now = Date.now();
  const nextRound = YHTEISHAKU_ROUNDS.find((round) => new Date(round.start).getTime() > now);
  if (!nextRound) return undefined;

  const diffMs = new Date(nextRound.start).getTime() - now;
  return {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
    label: nextRound.label,
  };
}

export default function useCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>();

  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}
