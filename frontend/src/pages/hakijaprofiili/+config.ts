import type { Config } from "vike/types";
import { DEFAULT_HAKIJAPROFIILI_ROUND } from "@/config/hakijaprofiiliRounds";
import { statisticsRoundShortLabel } from "@/config/yearOptions";

export default {
  title: `Hakijaprofiili – yhteishaun hakijoiden demografia (${statisticsRoundShortLabel(DEFAULT_HAKIJAPROFIILI_ROUND)})`,
} satisfies Config;
