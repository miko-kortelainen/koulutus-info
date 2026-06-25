import { readPublicData } from "@/api/loadData";
import type { SchoolsResponse } from "@/types.gen";

export const data = (): SchoolsResponse => readPublicData("schools.json");
