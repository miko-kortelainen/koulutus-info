import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import { CURRENT_YEAR } from "@/config/yearOptions";

export default {
  title: `Korkeakoulujen yhteishaku ${CURRENT_YEAR.slice(0, 4)} – pisterajat ja pistelaskuri`,
  prerender: true,
  extends: vikeReact,
  lang: "fi",
  trailingSlash: true,
} satisfies Config;
