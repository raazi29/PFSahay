"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TextArea } from "@/components/ui/Input";
import { Stepper } from "@/components/ui/Stepper";
import {
  ChatBubble,
  QuickReply,
  ThinkingIndicator,
  ExplanationCard,
} from "@/components/chat/Chat";
import { useClaim } from "@/context/ClaimContext";
import { useLanguage } from "@/context/LanguageContext";
import { classifyReason } from "@/lib/ai";
import { REASONS, CLAIM_PATHS } from "@/lib/mock-data/claims";
import type { ClaimReasonKey, ClassificationOutput } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

type Phase = "reason" | "thinking" | "clarify" | "done";

// Stepper steps — bilingual labels for the top progress bar.
const STEP_DEFS = [
  { key: "reason", en: "Reason", hi: "कारण" },
  { key: "check", en: "Check", hi: "जाँच" },
  { key: "documents", en: "Documents", hi: "दस्तावेज़" },
  { key: "review", en: "Review", hi: "समीक्षा" },
  { key: "submit", en: "Submit", hi: "सबमिट" },
];

const HOW_IT_WORKS = [
  { step: 1, title: { en: "Reason", hi: "कारण" }, desc: { en: "Tell us why you need your PF", hi: "बताएं आपको PF क्यों चाहिए" } },
  { step: 2, title: { en: "Check", hi: "जाँच" }, desc: { en: "We run checks against EPFO rules", hi: "हम EPFO नियमों के खिलाफ जाँच करते हैं" } },
  { step: 3, title: { en: "Documents", hi: "दस्तावेज़" }, desc: { en: "Upload supporting documents", hi: "सहायक दस्तावेज़ अपलोड करें" } },
  { step: 4, title: { en: "Review", hi: "समीक्षा" }, desc: { en: "Verify and submit", hi: "सत्यापित करें और सबमिट करें" } },
  { step: 5, title: { en: "Submit", hi: "सबमिट" }, desc: { en: "Track your claim status", hi: "अपनी दावा स्थिति ट्रैक करें" } },
];

const COMMON_ISSUES = [
  { en: "Name mismatch between Aadhaar and UAN", hi: "आधार और UAN के बीच नाम मिलान" },
  { en: "KYC not updated", hi: "KYC अपडेट नहीं है" },
  { en: "Bank not linked", hi: "बैंक लिंक नहीं है" },
  { en: "Incomplete documents", hi: "अधूरे दस्तावेज़" },
  { en: "Service history gaps", hi: "सेवा इतिहास में अंतराल" },
];

export default function ClaimAssistantPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { claim, user, setReason, setClassification } = useClaim();

  // Personalised greeting — uses the signed-in member's first name.
  const firstName = user?.name?.split(" ")[0] ?? "";
  const greeting =
    lang === "hi"
      ? `नमस्ते${firstName ? " " + firstName : ""} 👋 मैं आपका PF क्लेम करने में मदद करूँगा। ${t("reasonTitle")}`
      : `Hi${firstName ? " " + firstName : ""} 👋 I'll help you claim your PF. ${t("reasonTitle")}`;

  const [phase, setPhase] = useState<Phase>("reason");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: greeting },
  ]);
  const [typed, setTyped] = useState("");

  function reasonLabel(key: ClaimReasonKey) {
    const r = REASONS.find((x) => x.key === key);
    if (!r) return "";
    return lang === "hi" ? r.labelHi : r.label;
  }

  async function runClassification(input: ClaimReasonKey | string, display: string) {
    setPhase("thinking");
    setMessages((m) => [...m, { role: "user", text: display }]);
    const out = await classifyReason(input);
    setReason(out.intent, display);
    if (out.needs_clarification) {
      setMessages((m) => [...m, { role: "assistant", text: t("clarifyBody") }]);
      setPhase("clarify");
      return;
    }
    finish(out);
  }

  function finish(out: ClassificationOutput) {
    setClassification(out);
    const path = CLAIM_PATHS[out.claim_path];
    const summary = lang === "hi" ? path.summaryHi : path.summary;
    const reasonMeta = REASONS.find((r) => r.key === out.intent);
    const explanation =
      lang === "hi" && reasonMeta?.explanationHi ? reasonMeta.explanationHi : out.explanation;
    setMessages((m) => [
      ...m,
      { role: "assistant", text: explanation },
      { role: "assistant", text: `${path.label} — ${summary}` },
    ]);
    setPhase("done");
  }

  function onQuick(key: string) {
    if (phase !== "reason") return;
    runClassification(key as ClaimReasonKey, reasonLabel(key as ClaimReasonKey));
  }

  function onSend() {
    const text = typed.trim();
    if (!text) return;
    setTyped("");
    runClassification(text, text);
  }

  function onClarify() {
    const text = typed.trim();
    if (!text) return;
    setTyped("");
    setPhase("thinking");
    setMessages((m) => [...m, { role: "user", text }]);
    classifyReason(text).then((out) => {
      if (out.intent === "other") {
        finish({
          intent: "job_change",
          claim_path: "full_settlement",
          confidence: 0.7,
          needs_clarification: false,
          explanation: out.explanation || t("reasonTitle"),
          next_step: "verification",
        });
      } else {
        finish(out);
      }
    });
  }

  // All supported reasons rendered as a 2-column quick-reply grid.
  const reasonOptions = REASONS.map((r) => ({
    key: r.key as string,
    label: lang === "hi" ? r.labelHi : r.label,
  }));
  // QuickReply is retained from the shared chat API; the reason picker below is a
  // custom 2-column grid variant that adds a brand-highlighted "selected" state.
  void QuickReply;

  const activeStepKey = phase === "done" ? "check" : "reason";
  const activeStepIdx = STEP_DEFS.findIndex((s) => s.key === activeStepKey);
  const steps = STEP_DEFS.map((s) => ({ key: s.key, label: lang === "hi" ? s.hi : s.en }));
  const detectedPath = claim.claimPath ? CLAIM_PATHS[claim.claimPath] : null;

  const headerSubtitle =
    lang === "hi"
      ? "आइए आपकी ज़रूरत समझें और सही रास्ता खोजें।"
      : "Let's understand your need and find the right way.";

  // Progress checklist shown inside the "Your Claim Path" card.
  const claimChecklist = [
    { label: lang === "hi" ? "कारण समझा गया" : "Reason understood", done: !!claim.reason },
    { label: lang === "hi" ? "दावा पथ पहचाना" : "Claim path detected", done: !!detectedPath },
    { label: lang === "hi" ? "रिकॉर्ड जाँच" : "Records check", done: false },
    { label: lang === "hi" ? "दस्तावेज़ तैयार" : "Documents ready", done: false },
    { label: lang === "hi" ? "समीक्षा और सबमिट" : "Review & submit", done: false },
  ];

  return (
    <AppShell topBar={false}>
      {/* Mobile header */}
      <Header title={t("claimAssistant")} onBack={() => router.push("/dashboard")} />

      {/* Desktop header — "← Claim Assistant" + subtitle */}
      <div className="hidden border-b border-line bg-surface lg:block">
        <div className="mx-auto w-full max-w-4xl px-8 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              aria-label={t("back")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
            >
              <BackIcon />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-ink">{t("claimAssistant")}</h1>
              <p className="text-sm text-muted">{headerSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="border-b border-line bg-surface/60 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <Stepper steps={steps} current={activeStepKey} />
        </div>
      </div>

      <PageContainer className="flex flex-col gap-5 pt-5">
        {/* Two-column layout: chat + sidebar */}
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Main chat column */}
          <div className="flex min-w-0 flex-col">
            <div className="flex min-h-[280px] flex-1 flex-col gap-3">
              {messages.map((m, i) => {
                if (m.role === "user") {
                  return (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] animate-fade-in rounded-2xl rounded-br-md border border-primary/10 bg-primary-soft px-4 py-3 text-[15px] leading-relaxed text-ink">
                        {m.text}
                      </div>
                    </div>
                  );
                }
                const showAvatar = i === 0 || messages[i - 1].role !== "assistant";
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    {showAvatar ? <BotAvatar /> : <span className="w-8 shrink-0" aria-hidden />}
                    <div className="min-w-0 flex-1">
                      <ChatBubble role="assistant">{m.text}</ChatBubble>
                    </div>
                  </div>
                );
              })}

              {phase === "thinking" && (
                <div className="flex items-start gap-2.5">
                  <BotAvatar />
                  <div className="min-w-0 flex-1">
                    <ThinkingIndicator />
                  </div>
                </div>
              )}

              {phase === "done" && (
                <div className="flex items-start gap-2.5">
                  <span className="w-8 shrink-0" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <ExplanationCard title={t("foundTitle")}>
                      {t("pathLabel")}: <strong>{detectedPath?.label}</strong>
                    </ExplanationCard>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden space-y-4 lg:block">
            {/* Your Claim Path */}
            <Card>
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <RouteIcon />
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  {lang === "hi" ? "आपका दावा पथ" : "Your Claim Path"}
                </h3>
              </div>

              {detectedPath ? (
                <div className="space-y-3">
                  <Badge tone="success">{detectedPath.label}</Badge>

                  {claim.reasonText && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                        {lang === "hi" ? "कारण" : "Reason"}
                      </p>
                      <p className="text-sm font-medium text-ink">{claim.reasonText}</p>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed text-muted">
                    {lang === "hi" ? detectedPath.summaryHi : detectedPath.summary}
                  </p>

                  <div className="space-y-2 border-t border-line pt-3">
                    {claimChecklist.map((c, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        {c.done ? (
                          <CheckCircle2 size={16} className="shrink-0 text-success" />
                        ) : (
                          <span className="h-4 w-4 shrink-0 rounded-full border-2 border-line" />
                        )}
                        <span className={`text-sm ${c.done ? "text-ink" : "text-muted"}`}>
                          {c.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-muted">
                  {lang === "hi"
                    ? "शुरू करने के लिए कोई कारण चुनें। मैं आपके लिए सही दावा पथ पहचान लूँगा।"
                    : "Select a reason to begin. I'll detect the right claim path for you."}
                </p>
              )}
            </Card>

            {/* How it works */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "यह कैसे काम करता है" : "How it works"}
              </h3>
              <div className="space-y-3">
                {HOW_IT_WORKS.map((h) => (
                  <div key={h.step} className="flex items-start gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        h.step <= activeStepIdx + 1 ? "bg-primary text-white" : "bg-line text-muted"
                      }`}
                    >
                      {h.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {lang === "hi" ? h.title.hi : h.title.en}
                      </p>
                      <p className="text-xs text-muted">{lang === "hi" ? h.desc.hi : h.desc.en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Common issues I check */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "मैं सामान्य समस्याएँ जाँचता हूँ" : "Common issues I check"}
              </h3>
              <ul className="space-y-2.5">
                {COMMON_ISSUES.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <WarnIcon />
                    <span>{lang === "hi" ? issue.hi : issue.en}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Your data is secure */}
            <Card className="border-brand/15 bg-brand-soft">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <ShieldIcon />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    {lang === "hi" ? "आपका डेटा सुरक्षित है" : "Your data is secure"}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {lang === "hi"
                      ? "आपका विवरण एन्क्रिप्टेड है और केवल आपका दावा तैयार करने के लिए उपयोग होता है। हम इसे कभी साझा नहीं करते।"
                      : "Your details are encrypted and used only to prepare your claim. We never share them."}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Input area (sticky bottom) */}
        <div className="sticky bottom-0 -mx-4 border-t border-line bg-canvas/95 px-4 pb-5 pt-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {phase === "reason" && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {t("reasonSubtitle")}
              </p>

              {/* 2-column quick-reply grid */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {reasonOptions.map((o) => {
                  const selected = claim.reason === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => onQuick(o.key)}
                      className={
                        "flex items-center gap-2 rounded-xl border-2 px-3.5 py-3 text-left text-[14px] transition-colors " +
                        (selected
                          ? "border-brand bg-brand-soft font-semibold text-brand-dark"
                          : "border-line bg-surface font-medium text-ink hover:border-brand/50 hover:bg-brand-soft/40")
                      }
                    >
                      {selected ? (
                        <CheckCircle2 size={16} className="shrink-0 text-brand" />
                      ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-line" />
                      )}
                      <span className="min-w-0 flex-1">{o.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Text input + send button */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextArea
                    placeholder={t("reasonPlaceholder")}
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    className="min-h-[52px]"
                  />
                </div>
                <SendButton onClick={onSend} disabled={!typed.trim()} label={t("reasonSend")} />
              </div>
            </div>
          )}

          {phase === "clarify" && (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextArea
                  placeholder={t("clarifyPlaceholder")}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  className="min-h-[52px]"
                />
              </div>
              <SendButton onClick={onClarify} disabled={!typed.trim()} label={t("reasonSend")} />
            </div>
          )}

          {phase === "done" && (
            <Button block onClick={() => router.push("/claim/verify")}>
              {t("pathContinue")}
            </Button>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}

/* ----------------------------- UI primitives ----------------------------- */

// Brand-coloured assistant avatar shown beside bot messages.
function BotAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-soft">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l1.7 5.5L19 9l-5.3 1.5L12 16l-1.7-5.5L5 9l5.3-1.5L12 2z" />
      </svg>
    </span>
  );
}

// Navy send button that sits next to the chat text input.
function SendButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    </button>
  );
}

function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

// Orange warning icon for the "Common issues I check" list.
function WarnIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-accent"
      aria-hidden
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}
