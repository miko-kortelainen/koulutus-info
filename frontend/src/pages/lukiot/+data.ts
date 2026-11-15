import type { LukioKeskiarvoEntry } from "@/api/dataValidation";
import { readLukioKeskiarvot } from "@/api/serverData";

export type LukiotPageData = LukioKeskiarvoEntry[];

export const data = (): LukiotPageData => readLukioKeskiarvot();
