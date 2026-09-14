import type { Config } from "vike/types";
import { CURRENT_PROGRAMME_ROUND, programmeRoundLabel } from "@/config/programmeRounds";

export default {
  title: `Korkeakoulujen yhteishaun koulutustarjonta – ${programmeRoundLabel(CURRENT_PROGRAMME_ROUND)}`,
} satisfies Config;
