import type { ClaimReasonKey, ClassificationOutput } from "@/lib/types";
import { REASONS, CLAIM_PATHS } from "@/lib/mock-data/claims";

export function classifyReasonKey(key: ClaimReasonKey): ClassificationOutput {
  const meta = REASONS.find((r) => r.key === key);
  if (!meta) {
    return {
      intent: "other",
      claim_path: "needs_clarification",
      confidence: 0,
      needs_clarification: true,
      explanation: "",
      next_step: "clarification",
    };
  }
  const path = CLAIM_PATHS[meta.path];
  return {
    intent: meta.key,
    claim_path: meta.path,
    confidence: meta.key === "other" ? 0.4 : 0.96,
    needs_clarification: meta.path === "needs_clarification",
    explanation: meta.explanation,
    next_step: meta.path === "needs_clarification" ? "clarification" : "verification",
  };
}

const KEYWORDS: { key: Exclude<ClaimReasonKey, "other">; words: string[] }[] = [
  { key: "job_change", words: ["job", "company", "left", "resign", "switch", "employer", "quit"] },
  { key: "unemployed", words: ["unemploy", "jobless", "no work", "out of work", "not working"] },
  { key: "medical", words: ["medical", "hospital", "sick", "treatment", "health", "surgery"] },
  { key: "education", words: ["education", "study", "college", "school", "course", "university", "exam"] },
  { key: "house", words: ["house", "home", "property", "flat", "apartment", "build", "loan"] },
  { key: "retirement", words: ["retire", "pension", "old", "age", "superannuat"] },
];

// Stand-in for an LLM intent classifier. Maps free text to a supported reason.
export function classifyText(text: string): ClaimReasonKey {
  const t = text.toLowerCase();
  if (!t.trim()) return "other";
  for (const { key, words } of KEYWORDS) {
    if (words.some((w) => t.includes(w))) return key;
  }
  return "other";
}

// Maps an ambiguous/clarification answer back to a concrete reason when possible.
export function resolveClarification(text: string): ClaimReasonKey {
  return classifyText(text);
}
