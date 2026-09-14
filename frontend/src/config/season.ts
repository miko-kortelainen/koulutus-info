export interface YhteishakuRound {
  title: string;
  untilLabel: string;
  start: string;
  end: string;
}

export const YHTEISHAKU_ROUNDS: YhteishakuRound[] = [
  {
    title: "Kevään 2027 ensimmäinen yhteishaku",
    untilLabel: "Kevään 2027 ensimmäiseen yhteishakuun",
    start: "2027-01-07T08:00:00+02:00",
    end: "2027-01-21T15:00:00+02:00",
  },
  {
    title: "Kevään 2027 toinen yhteishaku",
    untilLabel: "Kevään 2027 toiseen yhteishakuun",
    start: "2027-03-09T08:00:00+02:00",
    end: "2027-03-23T15:00:00+02:00",
  },
  {
    title: "Syksyn 2027 yhteishaku",
    untilLabel: "Syksyn 2027 yhteishakuun",
    start: "2027-08-30T08:00:00+03:00",
    end: "2027-09-09T15:00:00+03:00",
  },
];

export interface CountdownTarget {
  at: string;
  caption: string;
}

export function nextCountdownTarget(now: number): CountdownTarget | undefined {
  for (const round of YHTEISHAKU_ROUNDS) {
    if (now < Date.parse(round.start)) return { at: round.start, caption: round.untilLabel };
    if (now < Date.parse(round.end)) return { at: round.end, caption: `${round.title} päättyy` };
  }
  return undefined;
}
