import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import { CURRENT_YEAR } from "@/config/yearOptions";

export default {
  title: `Yhteishaun ${CURRENT_YEAR.slice(0, 4)} hakijamäärät ja koulutukset | Yhteishaku.app`,
  prerender: true,
  extends: vikeReact,
  lang: "fi",
  trailingSlash: true,
} satisfies Config;
