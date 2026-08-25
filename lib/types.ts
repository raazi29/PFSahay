// Shared domain types for PFSahay.

export type Lang = "en" | "hi";

export type ClaimReasonKey =
  | "job_change"
  | "unemployed"
  | "medical"
  | "education"
  | "house"
  | "retirement"
  | "other"
  | null;

export type ClaimPathKey =
  | "full_settlement"
  | "partial_withdrawal"
  | "pension_claim"
  | "needs_clarification";

export type Severity = "info" | "warning" | "error";

export type IssueType =
  | "name_mismatch"
  | "bank_not_linked"
  | "pan_missing"
  | "aadhaar_missing";

export interface ValidationIssue {
  type: IssueType;
  severity: Severity;
  sourceA: string;
  valueA: string;
  sourceB: string;
  valueB: string;
  action: "update_name" | "link_bank" | "update_pan" | "update_aadhaar";
  resolved: boolean;
}

export interface ClassificationOutput {
  intent: ClaimReasonKey;
  claim_path: ClaimPathKey;
  confidence: number;
  needs_clarification: boolean;
  explanation: string;
  next_step: string;
}

export interface ValidationOutput {
  overall_status: "ok" | "needs_attention";
  issues: ValidationIssue[];
}

export interface StatusOutput {
  status: ClaimStatusKey;
  headline: string;
  explanation: string;
  user_action_required: boolean;
  next_action?: string;
}

export type ClaimStatusKey =
  | "submitted"
  | "under_verification"
  | "query_raised"
  | "approved"
  | "disbursed";

export interface DocumentItem {
  id: string;
  label: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
}

export interface ClaimState {
  reason: ClaimReasonKey;
  reasonText: string;
  clarification: string;
  claimPath: ClaimPathKey | null;
  classification: ClassificationOutput | null;
  issues: ValidationIssue[];
  resolvedIssues: string[];
  documents: DocumentItem[];
  submitted: boolean;
  referenceNumber: string | null;
  status: ClaimStatusKey | null;
}
