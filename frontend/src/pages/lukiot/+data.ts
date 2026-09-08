import { readLukioKeskiarvot } from "@/api/serverData";
import type { LukioKeskiarvoEntry } from "@/api/dataValidation";

export type LukiotPageData = LukioKeskiarvoEntry[];

export const data = (): LukiotPageData => readLukioKeskiarvot();
