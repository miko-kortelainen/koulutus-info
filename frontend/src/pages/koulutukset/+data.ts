import { readSchools } from "@/api/loadData";
import type { SchoolsResponse } from "@/types.gen";

export const data = (): SchoolsResponse => readSchools();
