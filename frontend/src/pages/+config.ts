import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

export default {
  title: "Yhteishaku.app – hakijamäärät ja koulutukset",
  prerender: true,
  extends: vikeReact,
  htmlAttributes: { lang: "fi" },
} satisfies Config;
