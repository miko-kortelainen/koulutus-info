// Pisteytysmalli: Taulukko 5 ja Taulukko 6, "Ammattikorkeakoulujen todistusvalinnassa käytettävät
// pisteytysmallit" (ammattikorkeakouluun.fi), voimassa vuoden 2026 haussa.
export type AmmScale = "1-5" | "1-3";
export type AmmGrade = 1 | 2 | 3 | 4 | 5;

export const AMM_GRADES: Record<AmmScale, AmmGrade[]> = {
  "1-5": [5, 4, 3, 2, 1],
  "1-3": [3, 2, 1],
};

export const AMM_MAX_SCORE = 150;

const YHTEISET_OSAT_POINTS: Record<AmmScale, Partial<Record<AmmGrade, number>>> = {
  "1-5": { 5: 20, 4: 15, 3: 10, 2: 5, 1: 1 },
  "1-3": { 3: 20, 2: 13, 1: 2 },
};

// [pisteet, kynnys ka(1-5)*100, kynnys ka(1-3)*100], suurimmasta pienimpään.
// Hakijan keskiarvo saa pisteet ensimmäisestä rivistä, jonka kynnyksen se saavuttaa tai ylittää.
const KA_TABLE: [points: number, ka5: number, ka3: number][] = [
  [90, 500, 300],
  [89, 497, 298],
  [88, 494, 296],
  [87, 491, 295],
  [86, 488, 293],
  [85, 485, 291],
  [84, 482, 289],
  [83, 479, 287],
  [82, 476, 286],
  [81, 473, 284],
  [80, 470, 282],
  [79, 467, 280],
  [78, 464, 278],
  [77, 461, 277],
  [76, 458, 275],
  [75, 455, 273],
  [74, 452, 271],
  [73, 449, 269],
  [72, 446, 267],
  [71, 442, 265],
  [70, 439, 263],
  [69, 435, 261],
  [68, 431, 259],
  [67, 428, 256],
  [66, 424, 254],
  [65, 420, 252],
  [64, 416, 250],
  [63, 413, 248],
  [62, 409, 245],
  [61, 405, 243],
  [60, 402, 241],
  [59, 398, 239],
  [58, 394, 237],
  [57, 391, 234],
  [56, 387, 232],
  [55, 383, 230],
  [54, 379, 228],
  [53, 376, 226],
  [52, 372, 223],
  [51, 368, 221],
  [50, 365, 219],
  [49, 361, 217],
  [48, 357, 215],
  [47, 354, 212],
  [46, 350, 210],
  [45, 346, 208],
  [44, 342, 205],
  [43, 337, 203],
  [42, 333, 200],
  [41, 329, 197],
  [40, 324, 195],
  [39, 320, 192],
  [38, 315, 189],
  [37, 311, 186],
  [36, 307, 184],
  [35, 302, 181],
  [34, 298, 178],
  [33, 293, 176],
  [32, 289, 173],
  [31, 285, 170],
  [30, 280, 168],
  [29, 276, 165],
  [28, 271, 162],
  [27, 267, 159],
  [26, 263, 157],
  [25, 258, 154],
  [24, 254, 151],
  [23, 249, 149],
  [22, 243, 147],
  [21, 237, 144],
  [20, 230, 142],
  [19, 224, 140],
  [18, 218, 138],
  [17, 212, 136],
  [16, 205, 134],
  [15, 199, 132],
  [14, 193, 130],
  [13, 186, 128],
  [12, 180, 126],
  [11, 174, 123],
  [10, 167, 121],
  [9, 161, 119],
  [8, 155, 117],
  [7, 149, 115],
  [6, 142, 113],
  [5, 136, 111],
  [4, 130, 109],
  [3, 123, 107],
  [2, 117, 105],
  [1, 111, 102],
  [0, 100, 100],
];

const keskiarvoPoints = (keskiarvo: number, scale: AmmScale): number => {
  const threshold = Math.round(keskiarvo * 100);
  const row = KA_TABLE.find(([, ka5, ka3]) => threshold >= (scale === "1-5" ? ka5 : ka3));
  return row ? row[0] : 0;
};

export interface AmmInput {
  scale: AmmScale;
  grades: [AmmGrade, AmmGrade, AmmGrade];
  keskiarvo: number;
}

export const calculateAmmScore = ({ scale, grades, keskiarvo }: AmmInput): number => {
  const gradePoints = grades.reduce((sum, grade) => sum + (YHTEISET_OSAT_POINTS[scale][grade] ?? 0), 0);
  return gradePoints + keskiarvoPoints(keskiarvo, scale);
};
