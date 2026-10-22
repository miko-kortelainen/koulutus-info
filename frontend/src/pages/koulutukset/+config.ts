import type { Config } from "vike/types";
import { CURRENT_PROGRAMME_ROUND } from "@/config/programmeRounds";

export default {
  title: `Korkeakoulujen yhteishaku ${CURRENT_PROGRAMME_ROUND.slice(0, 4)} – koulutukset ja hakukohteet`,
} satisfies Config;
