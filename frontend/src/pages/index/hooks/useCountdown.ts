import { useEffect, useState } from "react";
import { nextCountdownTarget } from "@/config/season";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  label: string;
}

function computeTimeLeft(now = Date.now()): TimeLeft | undefined {
  const target = nextCountdownTarget(now);
  if (!target) return undefined;

  const diffMs = Date.parse(target.at) - now;
  return {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
    label: target.caption,
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
