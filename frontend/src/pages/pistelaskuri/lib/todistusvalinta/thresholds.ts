import { GRADE_RANK } from "./constants";
import { type GradeInput, normalizeGrades } from "./grades";
import type { ExamInfo, ThresholdExpression, ThresholdRule } from "./types";

function expressionPasses(expression: ThresholdExpression, grades: Record<string, string>): boolean {
  if ("exam" in expression) {
    const achieved = GRADE_RANK[grades[expression.exam] ?? "I"] ?? 0;
    const required = GRADE_RANK[expression.minGrade] ?? Number.POSITIVE_INFINITY;
    return achieved >= required;
  }
  if ("any" in expression) return expression.any.some((child) => expressionPasses(child, grades));
  if ("all" in expression) return expression.all.every((child) => expressionPasses(child, grades));
  throw new Error(`Invalid threshold expression: ${JSON.stringify(expression)}`);
}

export function thresholdPassed(
  ruleId: string | null | undefined,
  grades: GradeInput,
  rules: ThresholdRule[],
  exams: Record<string, ExamInfo>,
): { label: string; passed: boolean } | null {
  if (ruleId == null) return null;
  const normalized = normalizeGrades(grades, exams);
  const rule = rules.find((item) => item.id === ruleId);
  if (rule === undefined) throw new Error(`Unknown threshold rule: ${JSON.stringify(ruleId)}`);
  return { label: rule.label, passed: expressionPasses(rule.expression, normalized) };
}
