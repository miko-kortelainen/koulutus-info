import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

export default {
  title: "Yhteishaun 2026 hakijamäärät ja koulutukset | Yhteishaku.app",
  prerender: true,
  extends: vikeReact,
  htmlAttributes: { lang: "fi" },
  trailingSlash: true,
} satisfies Config;
