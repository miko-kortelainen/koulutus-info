/** Shared constants for the 2026 certificate-selection calculator. */

export const CERTIFICATE_METHODS = new Set(["Todistusvalinta", "Todistusvalinta, ensikertalaiset"]);

export const AMK_METHODS = {
  yo: {
    labels: new Set(["Todistusvalinta (YO)", "Todistusvalinta (YO), ensikertalaiset"]),
    maximumScore: 198,
  },
  amm: {
    labels: new Set(["Todistusvalinta (AMM)", "Todistusvalinta (AMM), ensikertalaiset"]),
    maximumScore: 150,
  },
} as const;

export const AMM_SECTION_POINTS: Record<3 | 5, Record<number, number>> = {
  3: { 1: 2, 2: 13, 3: 20 },
  5: { 1: 1, 2: 5, 3: 10, 4: 15, 5: 20 },
};

/** Thresholds are already integer hundredths (e.g. 203 means 2.03). */
export const AMM_AVERAGE_THRESHOLDS: Record<3 | 5, readonly number[]> = {
  3: [
    300, 298, 296, 295, 293, 291, 289, 287, 286, 284, 282, 280, 278, 277, 275, 273, 271, 269, 267, 265, 263, 261, 259,
    256, 254, 252, 250, 248, 245, 243, 241, 239, 237, 234, 232, 230, 228, 226, 223, 221, 219, 217, 215, 212, 210, 208,
    205, 203, 200, 197, 195, 192, 189, 186, 184, 181, 178, 176, 173, 170, 168, 165, 162, 159, 157, 154, 151, 149, 147,
    144, 142, 140, 138, 136, 134, 132, 130, 128, 126, 123, 121, 119, 117, 115, 113, 111, 109, 107, 105, 102, 100,
  ],
  5: [
    500, 497, 494, 491, 488, 485, 482, 479, 476, 473, 470, 467, 464, 461, 458, 455, 452, 449, 446, 442, 439, 435, 431,
    428, 424, 420, 416, 413, 409, 405, 402, 398, 394, 391, 387, 383, 379, 376, 372, 368, 365, 361, 357, 354, 350, 346,
    342, 337, 333, 329, 324, 320, 315, 311, 307, 302, 298, 293, 289, 285, 280, 276, 271, 267, 263, 258, 254, 249, 243,
    237, 230, 224, 218, 212, 205, 199, 193, 186, 180, 174, 167, 161, 155, 149, 142, 136, 130, 123, 117, 111, 100,
  ],
};

export const GRADE_RANK: Record<string, number> = Object.fromEntries(
  [..."IABCMEL"].map((grade, rank) => [grade, rank]),
);
