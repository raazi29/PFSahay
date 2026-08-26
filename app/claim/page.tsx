"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { TopBarActions } from "@/components/layout/TopBar";
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
import { cn } from "@/lib/cn";
import { CheckCircle2, ChevronRight } from "lucide-react";

type Phase = "reason" | "thinking" | "clarify" | "done";

// Stepper steps — bilingual labels for the top progress bar.
const STEP_DEFS = [
  { key: "reason", en: "Reason", hi: "कारण" },
  { key: "check", en: "Check", hi: "जाँच" },
  { key: "documents", en: "Documents", hi: "दस्तावेज़" },
  { key: "review", en: "Review", hi: "समीक्षा" },
  { key: "submit", en: "Submit", hi: "सबमिट" },
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
    const closing =
      lang === "hi"
        ? "अभी के लिए बस इतना ही चाहिए। अपने विवरण जाँचने के लिए 'जारी रखें' दबाएं।"
        : "That's everything I need for now. Tap Continue and I'll check your details against EPFO records.";
    setMessages((m) => [
      ...m,
      { role: "assistant", text: explanation },
      { role: "assistant", text: `${path.label} — ${summary}` },
      { role: "assistant", text: closing },
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
  const steps = STEP_DEFS.map((s) => ({ key: s.key, label: lang === "hi" ? s.hi : s.en }));
  const detectedPath = claim.claimPath ? CLAIM_PATHS[claim.claimPath] : null;

  const headerSubtitle =
    lang === "hi"
      ? "आइए आपकी ज़रूरत समझें और सही रास्ता खोजें।"
      : "Let's understand your need and find the right way.";

  // "Claim Progress" vertical timeline shown in the sidebar — mirrors the top
  // Stepper's five stages with a one-line sub-description per step.
  const claimProgressSteps = [
    {
      key: "reason",
      en: "Reason",
      hi: "कारण",
      subEn: "Tell us why you need your PF",
      subHi: "हमें बताएं कि आपको PF की ज़रूरत क्यों है",
    },
    {
      key: "verification",
      en: "Verification",
      hi: "सत्यापन",
      subEn: "We'll verify your details",
      subHi: "हम आपके विवरण सत्यापित करेंगे",
    },
    {
      key: "documents",
      en: "Documents",
      hi: "दस्तावेज़",
      subEn: "Upload required documents",
      subHi: "आवश्यक दस्तावेज़ अपलोड करें",
    },
    {
      key: "review",
      en: "Review",
      hi: "समीक्षा",
      subEn: "Review your claim",
      subHi: "अपने दावे की समीक्षा करें",
    },
    {
      key: "submit",
      en: "Submit",
      hi: "सबमिट",
      subEn: "Submit to EPFO",
      subHi: "EPFO को सबमिट करें",
    },
  ];
  // Only "Reason" and "Verification" are reachable from this screen.
  const progressActiveIndex = phase === "done" ? 1 : 0;

  return (
    <AppShell topBar={false}>
      {/* Mobile header */}
      <Header title={t("claimAssistant")} onBack={() => router.push("/dashboard")} />

      {/* Desktop header + stepper — sticky as one unit so both stay visible while the chat scrolls */}
      <div className="sticky top-0 z-20 hidden lg:block">
        <div className="border-b border-line bg-surface">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-8 pt-6 pb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                aria-label={t("back")}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
              >
                <BackIcon />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-ink">{t("claimAssistant")}</h1>
                  <span className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand">
                    {lang === "hi" ? "AI संचालित" : "AI Powered"}
                  </span>
                </div>
                <p className="text-sm text-muted">{headerSubtitle}</p>
              </div>
            </div>
            <TopBarActions
              lang={lang}
              bankLinked={user.bank.linked}
              name={user.name}
              uan={user.uan}
              onLogout={() => router.push("/")}
            />
          </div>
        </div>

        {/* Stepper — opaque bg (not /60) since this now sits in the sticky block and
            chat content scrolls underneath it; a translucent background let scrolled
            messages bleed through and visually overlap the step labels. */}
        <div className="border-b border-line bg-surface px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <Stepper steps={steps} current={activeStepKey} />
          </div>
        </div>
      </div>

      {/* Stepper — mobile only (desktop stepper lives in the sticky block above) */}
      <div className="border-b border-line bg-surface px-4 py-4 sm:px-6 lg:hidden">
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

          {/* Right sidebar — sticky so it doesn't force blank scroll space beneath a short chat transcript */}
          <div className="hidden space-y-4 lg:sticky lg:top-40 lg:block lg:self-start">
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

                  <div className="rounded-xl bg-canvas p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      {lang === "hi" ? "अनुमानित दावा राशि" : "Estimated claim amount"}
                    </p>
                    <p className="text-xl font-bold text-ink">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(user.balance)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {lang === "hi" ? "यह केवल एक अनुमान है। अंतिम राशि भिन्न हो सकती है।" : "This is an estimate only. Final amount may vary."}
                    </p>
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

            {/* Claim Progress — connected vertical timeline */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "दावा प्रगति" : "Claim Progress"}
              </h3>
              <ol>
                {claimProgressSteps.map((s, i) => {
                  const active = i === progressActiveIndex;
                  const done = i < progressActiveIndex;
                  const isLast = i === claimProgressSteps.length - 1;
                  return (
                    <li
                      key={s.key}
                      className={cn(
                        "flex gap-3 rounded-lg",
                        active && "-mx-2 bg-brand-soft/60 px-2 py-1.5"
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                            active && "bg-brand text-white ring-4 ring-brand-soft",
                            done && !active && "bg-brand text-white",
                            !active && !done && "border-2 border-line text-muted"
                          )}
                          aria-current={active ? "step" : undefined}
                        >
                          {i + 1}
                        </span>
                        {!isLast && (
                          <span
                            className={cn("my-1 w-0.5 flex-1", done ? "bg-brand" : "bg-line")}
                            aria-hidden
                          />
                        )}
                      </div>
                      <div className={cn("min-w-0", isLast ? "pb-0" : "pb-4")}>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            active || done ? "text-ink" : "text-muted"
                          )}
                        >
                          {lang === "hi" ? s.hi : s.en}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {active
                            ? lang === "hi"
                              ? "आप यहां हैं"
                              : "You are here"
                            : lang === "hi"
                              ? s.subHi
                              : s.subEn}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>

            {/* We protect your data */}
            <Card className="border-brand/15 bg-brand-soft">
              <button type="button" className="flex w-full items-start gap-3 text-left">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <ShieldIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-ink">
                    {lang === "hi" ? "हम आपके डेटा की सुरक्षा करते हैं" : "We protect your data"}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {lang === "hi"
                      ? "256-बिट एन्क्रिप्शन • सुरक्षित सर्वर"
                      : "256-bit encryption • Secure servers"}
                  </p>
                </div>
                <ChevronRight size={18} className="mt-1 shrink-0 text-muted" aria-hidden />
              </button>
            </Card>
          </div>
        </div>

        {/* Input area (sticky bottom) — -mb-12 cancels PageContainer's trailing pb-12
            so this can actually stick to the viewport bottom instead of detaching early. */}
        <div className="sticky bottom-0 -mx-4 -mb-12 border-t border-line bg-canvas/95 px-4 pb-5 pt-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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

// Soft brand-coloured assistant avatar shown beside bot messages.
function BotAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
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
