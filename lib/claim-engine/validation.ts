import type { MockUser } from "@/lib/mock-data/user";
import type { ValidationIssue, ValidationOutput } from "@/lib/types";

function normalizeName(n: string): string {
  return n.toLowerCase().replace(/[^a-z]/g, "").trim();
}

// Deterministic validation. Issues that the user has already resolved are
// flagged so the UI can show them as fixed. This is the single source of truth
// for the hero "mismatch" demo — no randomness.
export function validateUser(
  user: MockUser,
  resolvedTypes: string[] = []
): ValidationOutput {
  const issues: ValidationIssue[] = [];

  if (normalizeName(user.uan_name) !== normalizeName(user.aadhaar_name)) {
    issues.push({
      type: "name_mismatch",
      severity: "warning",
      sourceA: "Aadhaar",
      valueA: user.aadhaar_name,
      sourceB: "UAN",
      valueB: user.uan_name,
      action: "update_name",
      resolved: resolvedTypes.includes("name_mismatch"),
    });
  }

  if (!user.kyc.pan) {
    issues.push({
      type: "pan_missing",
      severity: "error",
      sourceA: "EPFO records",
      valueA: "PAN not linked",
      sourceB: "Requirement",
      valueB: "PAN required",
      action: "update_pan",
      resolved: resolvedTypes.includes("pan_missing"),
    });
  }

  if (!user.bank.linked) {
    issues.push({
      type: "bank_not_linked",
      severity: "error",
      sourceA: "Bank",
      valueA: "Not linked",
      sourceB: "Requirement",
      valueB: "Linked account required",
      action: "link_bank",
      resolved: resolvedTypes.includes("bank_not_linked"),
    });
  }

  const overall = issues.some((i) => !i.resolved) ? "needs_attention" : "ok";
  return { overall_status: overall, issues };
}
