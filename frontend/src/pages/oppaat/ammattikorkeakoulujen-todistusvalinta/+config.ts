import type { Config } from "vike/types";
import { getGuide } from "@/pages/oppaat/guides";

export default {
  title: getGuide("ammattikorkeakoulujen-todistusvalinta").title,
} satisfies Config;
