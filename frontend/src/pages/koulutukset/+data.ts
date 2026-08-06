import { readCurrentProgramsWithAvailableCutoffs } from "@/api/serverData";
import type { CurrentProgramsResponse } from "@/types.gen";

export const data = (): CurrentProgramsResponse => readCurrentProgramsWithAvailableCutoffs();
