"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Timeline, type TimelineStage } from "@/components/tracker/Timeline";
import { useClaim } from "@/context/ClaimContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/cn";
import type { ClaimStatusKey } from "@/lib/types";
import {
  Copy,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bell,
  HelpCircle,
  Search,
  Check,
  FileText,
  Wallet,
  CircleAlert,
  Info,
  type LucideIcon,
} from "lucide-react";

const STAGES: TimelineStage[] = [
  { key: "submitted", label: "Claim Submitted" },
  { key: "under_verification", label: "Under Verification" },
  { key: "query_raised", label: "Query Raised" },
  { key: "approved", label: "Approved" },
  { key: "disbursed", label: "Disbursal" },
];

const STATUS_COPY: Record<ClaimStatusKey, { headline: string; explanation: string; action?: string }> = {
  submitted: {
    headline: "Your claim has been submitted.",
    explanation: "We have received your claim. It is now in the queue for checking.",
  },
  under_verification: {
    headline: "Your claim is being checked.",
    explanation:
      "Your submitted information is currently being verified. You don't need to do anything right now.",
  },
  query_raised: {
    headline: "We need one more thing from you.",
    explanation: "An officer has raised a query on your claim.",
    action: "Open the query and upload the requested document.",
  },
  approved: {
    headline: "Your claim is approved.",
    explanation: "Your claim has been approved and is being prepared for payment.",
  },
  disbursed: {
    headline: "Your money is on the way.",
    explanation: "The approved amount has been sent to your linked bank account.",
  },
};

const HI: Record<ClaimStatusKey, { headline: string; explanation: string; action?: string }> = {
  submitted: { headline: "आपका दावा जमा हो गया है।", explanation: "हमें आपका दावा मिल गया है। यह अब जाँच के लिए कतार में है।" },
  under_verification: { headline: "आपके दावे की जाँच हो रही है।", explanation: "आपकी जमा जानकारी की अभी जाँच हो रही है। अभी आपको कुछ नहीं करना है।" },
  query_raised: { headline: "हमें आपसे एक और चीज़ चाहिए।", explanation: "एक अधिकारी ने आपके दावे पर सवाल उठाया है।", action: "क्वेरी खोलें और मांगा गया दस्तावेज़ अपलोड करें।" },
  approved: { headline: "आपका दावा स्वीकृत है।", explanation: "आपका दावा स्वीकृत हो गया है और भुगतान की तैयारी हो रही है।" },
  disbursed: { headline: "आपका पैसा रास्ते में है।", explanation: "स्वीकृत राशि आपके जुड़े बैंक खाते में भेजी गई है।" },
};

// Per-status metadata for the "Current Status" hero card (label, badge, note, icon).
const STATUS_META: Record<
  ClaimStatusKey,
  {
    shortLabel: { en: string; hi: string };
    badge: { en: string; hi: string };
    note: { en: string; hi: string };
    Icon: LucideIcon;
  }
> = {
  submitted: {
    shortLabel: { en: "Submitted", hi: "जमा किया गया" },
    badge: { en: "In Queue", hi: "कतार में" },
    note: { en: "Usually picked up within 1 working day", hi: "आमतौर पर 1 कार्य दिवस में लिया जाता है" },
    Icon: FileText,
  },
  under_verification: {
    shortLabel: { en: "Under Verification", hi: "जाँच के अधीन" },
    badge: { en: "In Progress", hi: "प्रगति पर" },
    note: { en: "Usually takes 1–3 working days", hi: "आमतौर पर 1–3 कार्य दिवस लगते हैं" },
    Icon: Search,
  },
  query_raised: {
    shortLabel: { en: "Query Raised", hi: "प्रश्न उठाया गया" },
    badge: { en: "Action Needed", hi: "कार्रवाई आवश्यक" },
    note: { en: "Please respond to continue your claim", hi: "अपना दावा जारी रखने के लिए कृपया उत्तर दें" },
    Icon: CircleAlert,
  },
  approved: {
    shortLabel: { en: "Approved", hi: "स्वीकृत" },
    badge: { en: "Approved", hi: "स्वीकृत" },
    note: { en: "Payment is being prepared", hi: "भुगतान तैयार किया जा रहा है" },
    Icon: CheckCircle2,
  },
  disbursed: {
    shortLabel: { en: "Disbursed", hi: "वितरित" },
    badge: { en: "Completed", hi: "पूर्ण" },
    note: { en: "Amount sent to your bank account", hi: "राशि आपके बैंक खाते में भेजी गई" },
    Icon: Wallet,
  },
};

// User-facing 4-step progress view. "Approval / Query" collapses the
// query_raised + approved system statuses into a single visible step.
const PROGRESS_STEPS: {
  key: string;
  label: { en: string; hi: string };
  startKey: ClaimStatusKey;
  endKey: ClaimStatusKey;
}[] = [
  { key: "submitted", label: { en: "Claim Submitted", hi: "दावा जमा किया गया" }, startKey: "submitted", endKey: "submitted" },
  { key: "verification", label: { en: "Under Verification", hi: "जाँच के अधीन" }, startKey: "under_verification", endKey: "under_verification" },
  { key: "approval", label: { en: "Approval / Query", hi: "स्वीकृति / प्रश्न" }, startKey: "query_raised", endKey: "approved" },
  { key: "disbursal", label: { en: "Disbursal", hi: "वितरण" }, startKey: "disbursed", endKey: "disbursed" },
];

export default function TrackerPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { claim } = useClaim();
  const status: ClaimStatusKey = claim.status ?? "under_verification";
  const copy = lang === "hi" ? HI[status] : STATUS_COPY[status];
  const actionText = lang === "hi" ? HI[status].action : STATUS_COPY[status].action;
  const meta = STATUS_META[status];
  const StatusIcon = meta.Icon;
  const [copied, setCopied] = useState(false);
  const [submittedOn, setSubmittedOn] = useState("");

  // Format the display date on the client only, to avoid SSR/hydration drift.
  useEffect(() => {
    setSubmittedOn(
      new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
  }, [lang]);

  function copyRef() {
    if (claim.referenceNumber) {
      navigator.clipboard.writeText(claim.referenceNumber).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  const activeIdx = STAGES.findIndex((s) => s.key === status);

  return (
    <AppShell topBar={false}>
      <Header title={lang === "hi" ? "दावा ट्रैकर" : "Claim Tracker"} onBack={() => router.push("/dashboard")} />
      <PageContainer className="flex flex-col gap-5 pt-5">
        {/* Title */}
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-ink">
            {lang === "hi" ? "दावा ट्रैकर" : "Claim Tracker"}
          </h1>
          <p className="mt-1 text-[15px] leading-relaxed text-muted">
            {lang === "hi"
              ? "अपने PF दावे को वास्तविक समय में ट्रैक करें और जानें कि आगे क्या होगा।"
              : "Track your PF claim in real time and know what happens next."}
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Reference number */}
            {claim.referenceNumber && (
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {lang === "hi" ? "आपका दावा संदर्भ संख्या" : "Your Claim Reference Number"}
                    </p>
                    <p className="mt-1.5 break-all font-mono text-2xl font-bold tracking-tight text-ink">
                      {claim.referenceNumber}
                    </p>
                    {submittedOn && (
                      <p className="mt-1.5 text-xs text-muted">
                        {lang === "hi" ? `जमा किया गया: ${submittedOn}` : `Submitted on ${submittedOn}`}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={copyRef}
                    aria-label={lang === "hi" ? "संदर्भ संख्या कॉपी करें" : "Copy reference number"}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-canvas px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-line"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                    {copied
                      ? lang === "hi"
                        ? "कॉपी हो गया"
                        : "Copied"
                      : lang === "hi"
                        ? "कॉपी करें"
                        : "Copy"}
                  </button>
                </div>
              </Card>
            )}

            {/* Current status — navy gradient hero */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-ink text-white shadow-elevated">
              <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-white/5" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <StatusIcon size={30} strokeWidth={2} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/60">
                    {lang === "hi" ? "वर्तमान स्थिति" : "Current Status"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2.5">
                    <h2 className="text-[22px] font-bold leading-tight">{meta.shortLabel[lang]}</h2>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
                      {meta.badge[lang]}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/85">{copy.headline}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-white/70">
                    <Clock size={14} /> {meta.note[lang]}
                  </p>
                </div>
              </div>
            </Card>

            {/* Claim progress — clean vertical timeline */}
            <Card>
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "दावा प्रगति" : "Claim Progress"}
              </h3>
              <ol className="mt-5">
                {PROGRESS_STEPS.map((step, i) => {
                  const startIdx = STAGES.findIndex((s) => s.key === step.startKey);
                  const endIdx = STAGES.findIndex((s) => s.key === step.endKey);
                  const state =
                    activeIdx > endIdx ? "done" : activeIdx >= startIdx ? "current" : "pending";
                  const isLast = i === PROGRESS_STEPS.length - 1;
                  return (
                    <li key={step.key} className="flex gap-4">
                      {/* Dot + connector */}
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                            state === "done" && "bg-success text-white",
                            state === "current" && "bg-brand text-white ring-4 ring-brand/15",
                            state === "pending" && "bg-canvas text-muted ring-1 ring-line"
                          )}
                          aria-current={state === "current" ? "step" : undefined}
                        >
                          {state === "done" ? <Check size={16} strokeWidth={3} /> : i + 1}
                        </span>
                        {!isLast && (
                          <span
                            className={cn(
                              "my-1.5 w-0.5 flex-1",
                              state === "done" ? "bg-success" : "bg-line"
                            )}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className={cn("flex-1", isLast ? "pb-0" : "pb-6")}>
                        {state === "current" ? (
                          <div className="rounded-xl border-2 border-brand bg-brand-soft px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[15px] font-bold text-ink">{step.label[lang]}</p>
                              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                {lang === "hi" ? "अभी" : "Current"}
                              </span>
                            </div>
                            {submittedOn && <p className="mt-0.5 text-xs text-muted">{submittedOn}</p>}
                            {actionText && (
                              <p className="mt-1.5 text-[13px] font-medium text-warning">{actionText}</p>
                            )}
                          </div>
                        ) : (
                          <div className="pt-1.5">
                            <p
                              className={cn(
                                "text-[15px] font-medium",
                                state === "done" ? "text-ink" : "text-muted"
                              )}
                            >
                              {step.label[lang]}
                            </p>
                            {state === "done" && submittedOn && (
                              <p className="mt-0.5 text-xs text-muted">{submittedOn}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* View claim summary */}
              <div className="mt-1 border-t border-line pt-4">
                <button
                  onClick={() => router.push("/claim/review")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  {lang === "hi" ? "दावा सारांश देखें" : "View Claim Summary"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </Card>

            {/* While you wait */}
            <Card>
              <div className="flex items-center gap-2">
                <Info size={16} className="text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  {lang === "hi" ? "प्रतीक्षा करते समय" : "While you wait"}
                </h3>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {lang === "hi"
                  ? "अभी आपको कुछ करने की ज़रूरत नहीं है। हर चरण पर हम आपको अपडेट रखेंगे।"
                  : "You don't need to do anything right now. We'll keep you posted as your claim moves through each step."}
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { en: "Usually takes 15–30 days end to end", hi: "पूरी प्रक्रिया में आमतौर पर 15–30 दिन लगते हैं" },
                  { en: "You'll receive SMS updates on every change", hi: "हर बदलाव पर आपको SMS अपडेट मिलेंगे" },
                  { en: "Check back here anytime for the latest status", hi: "नवीनतम स्थिति के लिए कभी भी यहाँ देखें" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-ink">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
                    {lang === "hi" ? item.hi : item.en}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right sidebar */}
          <aside className="hidden space-y-4 lg:sticky lg:top-5 lg:block">
            {/* What does this mean? */}
            <Card className="border-primary/15 bg-primary/[0.04]">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  {lang === "hi" ? "इसका क्या मतलब है?" : "What does this mean?"}
                </h3>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-ink">{copy.explanation}</p>
              {actionText && (
                <p className="mt-2 rounded-lg bg-warning-soft px-3 py-2 text-[13px] font-medium text-warning">
                  {actionText}
                </p>
              )}
            </Card>

            {/* What happens next? (full journey timeline) */}
            <Card>
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "अगला क्या होता है?" : "What happens next?"}
              </h3>
              <div className="mt-4">
                <Timeline stages={STAGES} current={status} />
              </div>
            </Card>

            {/* Stay updated */}
            <Card>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Bell size={16} />
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  {lang === "hi" ? "अपडेट रहें" : "Stay updated"}
                </h3>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {lang === "hi"
                  ? "हम आपको हर स्थिति परिवर्तन पर सूचित करेंगे।"
                  : "We'll notify you on every status change."}
              </p>
              <button className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                {lang === "hi" ? "सूचना सेटिंग्स" : "Notification Settings"}
                <ArrowRight size={13} />
              </button>
            </Card>

            {/* Have questions? */}
            <Card>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <HelpCircle size={16} />
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  {lang === "hi" ? "सवाल हैं?" : "Have questions?"}
                </h3>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {lang === "hi"
                  ? "हमारी सहायता टीम मदद के लिए तैयार है।"
                  : "Our support team is here to help."}
              </p>
              <button className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                {lang === "hi" ? "सहायता केंद्र" : "Help Center"}
                <ArrowRight size={13} />
              </button>
            </Card>
          </aside>
        </div>

        <Button variant="secondary" block onClick={() => router.push("/dashboard")}>
          {t("back")}
        </Button>

        <p className="text-center text-xs text-muted">{t("demoDisclaimer")}</p>
      </PageContainer>
    </AppShell>
  );
}
