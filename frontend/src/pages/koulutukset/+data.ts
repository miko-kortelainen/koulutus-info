import { readSchoolsWithAvailableCutoffs } from "@/api/serverData";
import type { SchoolsResponse } from "@/types.gen";

export const data = (): SchoolsResponse => readSchoolsWithAvailableCutoffs();
