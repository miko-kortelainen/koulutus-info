import type { Config } from "vike/types";
import { CURRENT_PROGRAMME_ROUND, programmeRoundLabel } from "@/config/programmeRounds";

export default {
  title: `Korkeakoulujen yhteishaku ${CURRENT_PROGRAMME_ROUND.slice(0, 4)} – koulutukset ja hakukohteet (${programmeRoundLabel(CURRENT_PROGRAMME_ROUND)})`,
} satisfies Config;
