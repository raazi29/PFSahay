"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { TopBarActions } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SummaryRowBordered as SummaryRow, ShareRow, HelpRow } from "@/components/ui/Helpers";
import { useClaim } from "@/context/ClaimContext";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_USER } from "@/lib/mock-data/user";
import { CLAIM_PATHS } from "@/lib/mock-data/claims";
import {
  Check,
  CheckCircle2,
  Copy,
  FileText,
  ArrowRight,
  Download,
  Share2,
  Link2,
  MessageSquare,
  Phone,
  BookOpen,
  Lock,
  Bell,
  Wallet,
  Clock,
  ShieldCheck,
} from "lucide-react";

const WHAT_HAPPENS = [
  {
    step: 1,
    title: { en: "Verification", hi: "सत्यापन" },
    desc: { en: "EPFO will verify your details and documents.", hi: "EPFO आपका विवरण और दस्तावेज़ सत्यापित करेगा।" },
    time: { en: "1–3 days", hi: "1–3 दिन" },
  },
  {
    step: 2,
    title: { en: "Approval / Query", hi: "अनुमोदन / क्वेरी" },
    desc: { en: "If everything is correct, your claim will be approved.", hi: "सब सही है तो दावा स्वीकृत होगा।" },
    time: { en: "3–7 days", hi: "3–7 दिन" },
  },
  {
    step: 3,
    title: { en: "Disbursal", hi: "भुगतान" },
    desc: { en: "Once approved, your amount will be sent to your bank account.", hi: "स्वीकृत होने पर, राशि आपके बैंक खाते में भेजी जाएगी।" },
    time: { en: "7–20 days", hi: "7–20 दिन" },
  },
];

export default function SubmittedPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { claim, user } = useClaim();
  const [copied, setCopied] = useState(false);

  const detectedPath = claim.claimPath ? CLAIM_PATHS[claim.claimPath] : null;

  // The full claim journey — every step is complete on this terminal screen.
  const journey = [
    { key: "reason", label: t("stepReason") },
    { key: "verify", label: t("stepVerify") },
    { key: "docs", label: t("stepDocs") },
    { key: "review", label: t("stepReview") },
    { key: "submit", label: lang === "hi" ? "जमा" : "Submit" },
  ];

  function copyRef() {
    if (claim.referenceNumber) {
      navigator.clipboard.writeText(claim.referenceNumber).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <AppShell topBar={false}>
      <Header title={lang === "hi" ? "दावा सबमिट" : "Claim Submitted"} />
      <PageContainer className="flex flex-col gap-5 pt-5">
        {/* Desktop-only top actions row — no title text on this confirmation screen,
            so we keep it to just the shared cluster for app-shell consistency. Sticky
            so it stays visible while content scrolls. */}
        <div className="sticky top-0 z-20 -mt-5 hidden justify-end bg-canvas/95 pt-5 pb-3 backdrop-blur-md lg:flex">
          <TopBarActions
            lang={lang}
            bankLinked={user.bank.linked}
            name={user.name}
            uan={user.uan}
            onLogout={() => router.push("/")}
          />
        </div>

        {/* Stepper — all five steps completed */}
        <Card className="!p-4">
          <ol className="flex items-start gap-1" aria-label={lang === "hi" ? "प्रगति" : "Progress"}>
            {journey.map((s, i) => (
              <li key={s.key} className="flex flex-1 items-center gap-1">
                <div className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow-sm shadow-brand/30 animate-scale-in">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  <span className="text-center text-[10px] font-medium leading-tight text-brand">
                    {s.label}
                  </span>
                </div>
                {i < journey.length - 1 && (
                  <span className="mt-[-16px] h-0.5 flex-1 rounded-full bg-brand" aria-hidden />
                )}
              </li>
            ))}
          </ol>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Success hero */}
            <Card className="relative overflow-hidden text-center py-10 border-success/30 bg-gradient-to-b from-success/[0.07] to-transparent">
              {/* Large success animation — green circle with checkmark */}
              <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-success/10 animate-ping"
                  style={{ animationDuration: "2.4s" }}
                />
                <span aria-hidden className="absolute inset-3 rounded-full bg-success/15" />
                <span className="relative flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/40 animate-scale-in">
                  <Check size={46} strokeWidth={3} />
                </span>
              </div>
              <h1 className="text-[22px] sm:text-2xl font-bold text-ink tracking-tight">
                {lang === "hi"
                  ? "आपका दावा सफलतापूर्वक सबमिट हो गया!"
                  : "Your claim has been submitted successfully!"}
              </h1>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-muted leading-relaxed">
                {lang === "hi"
                  ? "हमने आपका दावा सत्यापन के लिए EPFO को भेज दिया है।"
                  : "We've sent your claim to EPFO for verification."}
              </p>
            </Card>

            {/* Reference number */}
            {claim.referenceNumber && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent">
                <p className="text-center text-sm text-muted">
                  {lang === "hi" ? "आपकी संदर्भ संख्या" : "Your Reference Number"}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                  <p className="rounded-xl border border-primary/15 bg-surface px-4 py-2 text-2xl font-bold text-primary font-mono tracking-wider">
                    {claim.referenceNumber}
                  </p>
                  <button
                    onClick={copyRef}
                    aria-label={lang === "hi" ? "संदर्भ संख्या कॉपी करें" : "Copy reference number"}
                    className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
                  >
                    {copied ? (
                      <CheckCircle2 size={15} className="text-success" />
                    ) : (
                      <Copy size={15} className="text-primary" />
                    )}
                    {copied
                      ? lang === "hi"
                        ? "कॉपी हुआ"
                        : "Copied"
                      : lang === "hi"
                        ? "कॉपी"
                        : "Copy"}
                  </button>
                </div>
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted">
                  <Clock size={12} />
                  {user.lastUpdated}
                </p>
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-success/[0.08] px-4 py-3">
                  <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {lang === "hi" ? "कृपया अपनी संदर्भ संख्या सहेजें" : "Please save your reference number"}
                    </p>
                    <p className="text-xs text-muted">
                      {lang === "hi"
                        ? "दावा स्थिति ट्रैक करने के लिए आपको इसकी आवश्यकता होगी।"
                        : "You'll need it to track your claim status."}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Claim Summary */}
            <Card>
              <h3 className="text-lg font-bold text-ink mb-4">
                {lang === "hi" ? "दावा सारांश" : "Claim Summary"}
              </h3>
              <div className="space-y-1">
                <SummaryRow icon={FileText} label={lang === "hi" ? "दावा प्रकार" : "Claim Type"} value={detectedPath?.label ?? "—"} />
                <SummaryRow icon={MessageSquare} label={lang === "hi" ? "कारण" : "Reason"} value={claim.reasonText || "—"} />
                <SummaryRow icon={Wallet} label={lang === "hi" ? "अपेक्षित भुगतान" : "Expected Payout"} value={new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(user.balance)} highlight />
                <SummaryRow icon={Clock} label={lang === "hi" ? "अनुमानित समय" : "Est. Timeline"} value={lang === "hi" ? "बदलता रहता है" : "Varies"} />
                <SummaryRow icon={FileText} label={lang === "hi" ? "अपलोड किए गए दस्तावेज़" : "Documents Uploaded"} value={`${claim.documents.filter((d) => d.uploaded).length} of ${claim.documents.length}`} />
                <SummaryRow icon={ShieldCheck} label={lang === "hi" ? "KYC स्थिति" : "KYC Status"} value={lang === "hi" ? "सत्यापित" : "Verified"} />
              </div>
            </Card>

            {/* Stay updated */}
            <Card className="relative overflow-hidden border-primary/15 bg-gradient-to-br from-primary/[0.05] to-brand/[0.05]">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Bell size={20} className="text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-ink">
                    {lang === "hi" ? "अपडेट रहें, हमेशा" : "Stay updated, always"}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {lang === "hi"
                      ? "हम हर कदम पर SMS और इन-ऐप सूचनाओं के माध्यम से आपको सूचित करेंगे।"
                      : "We'll notify you at every step via SMS and in-app notifications."}
                  </p>
                  <button className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    {lang === "hi" ? "सूचनाएं प्रबंधित करें" : "Manage Notifications"} <ArrowRight size={13} />
                  </button>
                </div>

                {/* Phone illustration */}
                <div aria-hidden className="relative hidden shrink-0 sm:block">
                  <div className="relative h-[108px] w-[60px] rotate-6 rounded-[16px] border-[3px] border-primary/20 bg-surface p-1.5 shadow-card">
                    <span className="absolute left-1/2 top-[5px] h-1 w-5 -translate-x-1/2 rounded-full bg-primary/15" />
                    <div className="mt-3 flex flex-col gap-1.5">
                      <div className="animate-float rounded-lg border border-line bg-surface px-1.5 py-1.5 shadow-soft">
                        <div className="flex items-center gap-1">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand">
                            <Bell size={9} className="text-white" />
                          </span>
                          <span className="h-1 w-6 rounded-full bg-primary/25" />
                        </div>
                        <span className="mt-1 block h-1 w-full rounded-full bg-line" />
                        <span className="mt-0.5 block h-1 w-2/3 rounded-full bg-line" />
                      </div>
                      <div className="rounded-lg border border-line bg-canvas px-1.5 py-1.5">
                        <span className="block h-1 w-8 rounded-full bg-success/40" />
                        <span className="mt-1 block h-1 w-full rounded-full bg-line" />
                      </div>
                    </div>
                  </div>
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-success text-white shadow-md ring-2 ring-surface">
                    <Check size={13} strokeWidth={3} />
                  </span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" className="flex-1" onClick={() => router.push("/dashboard")}>
                {lang === "hi" ? "डैशबोर्ड पर वापस" : "Back to Dashboard"}
              </Button>
              <Button
                className="flex-1 gap-2 !bg-brand hover:!bg-brand-dark active:!bg-brand-dark"
                onClick={() => router.push("/claim/tracker")}
              >
                {t("submitTrack")}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Right sidebar — sticky so it doesn't force blank scroll space */}
          <div className="space-y-4 hidden lg:sticky lg:top-16 lg:block lg:self-start">
            {/* What happens next */}
            <Card>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide mb-4">
                {lang === "hi" ? "अगला क्या होता है?" : "What happens next?"}
              </h3>
              <div className="space-y-4">
                {WHAT_HAPPENS.map((h, i) => (
                  <div key={h.step} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white text-xs font-bold shadow-sm shadow-brand/30">
                        {h.step}
                      </span>
                      {i < WHAT_HAPPENS.length - 1 && (
                        <div className="mt-1 h-6 w-0.5 bg-brand/25" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink">
                        {lang === "hi" ? h.title.hi : h.title.en}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {lang === "hi" ? h.desc.hi : h.desc.en}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
                        <Clock size={10} />
                        {lang === "hi" ? h.time.hi : h.time.en}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Download & Share */}
            <Card>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide mb-3">
                {lang === "hi" ? "डाउनलोड और शेयर" : "Download & Share"}
              </h3>
              <div className="space-y-1">
                <ShareRow icon={Download} label={lang === "hi" ? "दावा सारांश डाउनलोड करें" : "Download Claim Summary"} sub="PDF" />
                <ShareRow icon={Share2} label={lang === "hi" ? "ईमेल से शेयर करें" : "Share with Email"} sub={lang === "hi" ? "अपने इनबॉक्स में भेजें" : "Send to your inbox"} />
                <ShareRow icon={Link2} label={lang === "hi" ? "संदर्भ संख्या शेयर करें" : "Share Reference Number"} sub={lang === "hi" ? "किसी को भेजें" : "Send to someone"} />
              </div>
            </Card>

            {/* Need help */}
            <Card>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide mb-3">
                {lang === "hi" ? "मदद चाहिए?" : "Need help?"}
              </h3>
              <p className="text-sm text-muted mb-3">
                {lang === "hi" ? "हम आपके लिए हैं।" : "We're here for you."}
              </p>
              <div className="space-y-2">
                <HelpRow icon={MessageSquare} title={lang === "hi" ? "लाइव चैट" : "Live Chat"} sub={lang === "hi" ? "सहायक से चैट करें" : "Chat with assistant"} />
                <HelpRow icon={Phone} title={lang === "hi" ? "कॉल सपोर्ट" : "Call Support"} sub={lang === "hi" ? "हमारी टीम से बात करें" : "Talk to our team"} />
                <HelpRow icon={BookOpen} title={lang === "hi" ? "सहायता केंद्र" : "Help Center"} sub={lang === "hi" ? "मार्गदर्शिकाएँ और FAQ" : "Guides & FAQs"} />
              </div>
            </Card>

            {/* Your data is safe */}
            <Card>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Lock size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">
                    {lang === "hi" ? "आपका डेटा सुरक्षित है" : "Your data is safe"}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {lang === "hi"
                      ? "हम आपकी जानकारी को सुरक्षित और निजी रखते हैं।"
                      : "We keep your information private and secure."}
                  </p>
                  <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline mt-1">
                    {lang === "hi" ? "और जानें" : "Learn more"} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted">{t("demoDisclaimer")}</p>
      </PageContainer>
    </AppShell>
  );
}
