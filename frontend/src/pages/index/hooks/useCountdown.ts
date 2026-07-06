import { useEffect, useState } from "react";

const YHTEISHAKU_PAATTYY = new Date("2026-08-31T23:59:59");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function computeTimeLeft(): TimeLeft {
  const diffMs = Math.max(0, YHTEISHAKU_PAATTYY.getTime() - Date.now());
  return {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
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
