import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

export default {
  title: `Yhteishaku.app – korkeakoulujen yhteishaun tilastot`,
  prerender: true,
  extends: vikeReact,
  lang: "fi",
  trailingSlash: true,
} satisfies Config;
