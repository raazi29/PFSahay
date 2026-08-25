"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClaim } from "@/context/ClaimContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";

export function DemoControls() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const { reset, seedGolden, submit, setUserBankLinked, setUserUanName, setForceSubmitFail, forceSubmitFail, user } = useClaim();
  const toast = useToast();

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-2">
      {open && (
        <div className="w-60 rounded-2xl border border-line bg-surface p-3 shadow-card animate-fade-in">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
            Demo mode
          </p>
          <div className="flex flex-col gap-1">
            <Item
              onClick={() => {
                reset();
                go("/");
              }}
            >
              Reset journey
            </Item>
            <Item
              onClick={() => {
                seedGolden();
                go("/claim/verify");
              }}
            >
              Jump to mismatch
            </Item>
            <Item
              onClick={() => {
                seedGolden();
                go("/claim/review");
              }}
            >
              Jump to review
            </Item>
            <Item
              onClick={() => {
                seedGolden();
                submit();
                go("/claim/tracker");
              }}
            >
              Jump to tracker
            </Item>
            <Item
              onClick={() => {
                const next = !user.bank.linked;
                setUserBankLinked(next);
                setOpen(false);
                toast(next ? "Bank linked — extra issue cleared" : "Simulated bank not linked (affects verification)", next ? "success" : "info");
              }}
            >
              {user.bank.linked ? "Simulate extra issue" : "Clear extra issue"}
            </Item>
            <Item
              onClick={() => {
                const isClean = user.uan_name === user.aadhaar_name;
                setUserUanName(
                  isClean
                    ? user.aadhaar_name.split(" ")[0][0] + ". " + user.aadhaar_name.split(" ").slice(-1)[0]
                    : user.aadhaar_name
                );
                setOpen(false);
                toast(isClean ? "Simulated name mismatch restored" : "Clean records — name now matches", "info");
              }}
            >
              {user.uan_name === user.aadhaar_name ? "Restore name mismatch" : "Simulate clean records"}
            </Item>
            <Item
              onClick={() => {
                const next = !forceSubmitFail;
                setForceSubmitFail(next);
                setOpen(false);
                toast(next ? "Submit failure simulation ON" : "Submit failure simulation OFF", next ? "error" : "success");
              }}
            >
              {forceSubmitFail ? "Disable submit failure" : "Simulate submit failure"}
            </Item>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-line bg-surface px-3 py-2 text-xs font-semibold text-muted shadow-soft hover:text-ink"
        aria-label="Demo controls"
      >
        Demo
      </button>
    </div>
  );
}

function Item({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-canvas"
    >
      {children}
    </button>
  );
}
