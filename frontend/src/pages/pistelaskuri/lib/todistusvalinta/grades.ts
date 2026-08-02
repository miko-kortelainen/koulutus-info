import { GRADE_RANK } from "./constants";
import type { ExamInfo } from "./types";

export type GradeInput = Record<string, string>;

/** Validate exam codes and keep the best grade for duplicate attempts. */
export function normalizeGrades(grades: GradeInput, exams: Record<string, ExamInfo>): Record<string, string> {
  const normalized: Record<string, string> = {};

  for (const [exam, grade] of Object.entries(grades)) {
    const code = exam.trim().toLowerCase().replaceAll("-", "_");
    if (!(code in exams)) throw new Error(`Unknown matriculation exam: ${JSON.stringify(exam)}`);

    const normalizedGrade = String(grade).trim().toUpperCase();
    if (!(normalizedGrade in GRADE_RANK)) {
      throw new Error(`Invalid grade for ${JSON.stringify(exam)}: ${JSON.stringify(normalizedGrade)}`);
    }
    const current = normalized[code];
    const newRank = GRADE_RANK[normalizedGrade] ?? -1;
    const currentRank = current === undefined ? -1 : (GRADE_RANK[current] ?? -1);
    if (current === undefined || newRank > currentRank) {
      normalized[code] = normalizedGrade;
    }
  }

  if ("ai" in normalized) {
    const languageSpecific = [
      "ai_fi",
      "ai_sv",
      "ai_smn",
      "ai_smi",
      "ai_sms",
      "s2",
      "r2",
      "fia",
      "fib",
      "rua",
      "rub",
      "saame",
      "smn_b",
      "smi_b",
      "sms_b",
    ];
    if (languageSpecific.some((code) => code in normalized)) {
      throw new Error(
        "Use a language-specific mother-tongue code instead of 'ai' when another Finnish, Swedish, or Sami exam is present",
      );
    }
  }

  if (
    "saame" in normalized &&
    ["ai_smn", "ai_smi", "ai_sms", "smn_b", "smi_b", "sms_b"].some((code) => code in normalized)
  ) {
    throw new Error("Use a language-specific short-Sami code when another Sami exam is present");
  }

  return normalized;
}
