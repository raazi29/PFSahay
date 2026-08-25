"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ClaimState, ClassificationOutput, ValidationIssue } from "@/lib/types";
import { MOCK_USER, defaultDocuments, type MockUser } from "@/lib/mock-data/user";
import { validateUser } from "@/lib/claim-engine/validation";
import { classifyReasonKey } from "@/lib/claim-engine/classification";

interface ClaimContextValue {
  claim: ClaimState;
  user: MockUser;
  issues: ValidationIssue[];
  hasBlockingIssue: boolean;
  setReason: (key: ClaimState["reason"], text: string) => void;
  setClassification: (out: ClassificationOutput) => void;
  setClarification: (text: string) => void;
  resolveIssue: (type: string) => void;
  setUserBankLinked: (linked: boolean) => void;
  setUserUanName: (name: string) => void;
  uploadDocument: (id: string, fileName: string) => void;
  removeDocument: (id: string) => void;
  submit: () => void;
  forceSubmitFail: boolean;
  setForceSubmitFail: (v: boolean) => void;
  seedGolden: () => void;
  reset: () => void;
}

const ClaimContext = createContext<ClaimContextValue | null>(null);

const STORAGE_KEY = "pfsahay.claim";

function freshClaim(): ClaimState {
  return {
    reason: null,
    reasonText: "",
    clarification: "",
    claimPath: null,
    classification: null,
    issues: [],
    resolvedIssues: [],
    documents: defaultDocuments(),
    submitted: false,
    referenceNumber: null,
    status: null,
  };
}

export function ClaimProvider({ children }: { children: React.ReactNode }) {
  const [claim, setClaim] = useState<ClaimState>(freshClaim);
  const [user, setUser] = useState<MockUser>(MOCK_USER);
  const [hydrated, setHydrated] = useState(false);
  const [forceSubmitFail, setForceSubmitFail] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setClaim({ ...freshClaim(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claim));
  }, [claim, hydrated]);

  const issues = useMemo(
    () => validateUser(user, claim.resolvedIssues).issues,
    [user, claim.resolvedIssues]
  );

  const hasBlockingIssue = useMemo(
    () => issues.some((i) => !i.resolved && i.severity === "error"),
    [issues]
  );

  const setReason = useCallback((key: ClaimState["reason"], text: string) => {
    setClaim((c) => ({ ...c, reason: key, reasonText: text }));
  }, []);

  const setClassification = useCallback((out: ClassificationOutput) => {
    setClaim((c) => ({
      ...c,
      classification: out,
      claimPath: out.claim_path,
      reason: out.intent,
    }));
  }, []);

  const setClarification = useCallback((text: string) => {
    setClaim((c) => ({ ...c, clarification: text }));
  }, []);

  const resolveIssue = useCallback((type: string) => {
    setClaim((c) => ({
      ...c,
      resolvedIssues: c.resolvedIssues.includes(type)
        ? c.resolvedIssues
        : [...c.resolvedIssues, type],
    }));
  }, []);

  const setUserBankLinked = useCallback((linked: boolean) => {
    setUser((u) => ({ ...u, bank: { ...u.bank, linked } }));
  }, []);

  const setUserUanName = useCallback((name: string) => {
    setUser((u) => ({ ...u, uan_name: name }));
  }, []);

  const uploadDocument = useCallback((id: string, fileName: string) => {
    setClaim((c) => ({
      ...c,
      documents: c.documents.map((d) =>
        d.id === id ? { ...d, uploaded: true, fileName } : d
      ),
    }));
  }, []);

  const removeDocument = useCallback((id: string) => {
    setClaim((c) => ({
      ...c,
      documents: c.documents.map((d) =>
        d.id === id ? { ...d, uploaded: false, fileName: undefined } : d
      ),
    }));
  }, []);

  const submit = useCallback(() => {
    const ref = `PF-2026-${Math.floor(100000 + Math.random() * 899999)}`;
    setClaim((c) => ({
      ...c,
      submitted: true,
      referenceNumber: ref,
      status: "under_verification",
    }));
  }, []);

  // Used by Demo Mode "jump" controls to make a later step reachable.
  const seedGolden = useCallback(() => {
    const out = classifyReasonKey("job_change");
    setClaim((c) => ({
      ...c,
      reason: "job_change",
      reasonText: "I changed jobs",
      classification: out,
      claimPath: out.claim_path,
      // Seed documents as uploaded so Review/Submit work
      documents: c.documents.map((d) =>
        d.required ? { ...d, uploaded: true, fileName: d.id + "-mock.jpg" } : d
      ),
      // Resolve name mismatch so Continue isn't blocked
      resolvedIssues: c.resolvedIssues.includes("name_mismatch")
        ? c.resolvedIssues
        : [...c.resolvedIssues, "name_mismatch"],
      submitted: c.submitted,
      referenceNumber: c.referenceNumber ?? null,
      status: c.status,
    }));
  }, []);

  const reset = useCallback(() => {
    setClaim(freshClaim());
    setUser(MOCK_USER);
  }, []);

  const value: ClaimContextValue = {
    claim,
    user,
    issues,
    hasBlockingIssue,
    setReason,
    setClassification,
    setClarification,
    resolveIssue,
    setUserBankLinked,
    setUserUanName,
    uploadDocument,
    removeDocument,
    submit,
    forceSubmitFail,
    setForceSubmitFail,
    seedGolden,
    reset,
  };

  return <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>;
}

export function useClaim() {
  const ctx = useContext(ClaimContext);
  if (!ctx) throw new Error("useClaim must be used within ClaimProvider");
  return ctx;
}
