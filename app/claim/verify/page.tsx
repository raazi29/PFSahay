"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { TopBarActions } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import { SummaryRow, HelpRow } from "@/components/ui/Helpers";
import { Skeleton } from "@/components/ui/Feedback";
import { useClaim } from "@/context/ClaimContext";
import { useLanguage } from "@/context/LanguageContext";
import { CLAIM_PATHS } from "@/lib/mock-data/claims";
import { cn } from "@/lib/cn";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Fingerprint,
  Info,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Smartphone,
  User,
} from "lucide-react";

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const COMMON_ISSUES = [
  { en: "Name mismatch", hi: "नाम मिलान नहीं" },
  { en: "KYC not updated", hi: "KYC अपडेट नहीं" },
  { en: "Bank not linked", hi: "बैंक लिंक नहीं" },
  { en: "Incomplete documents", hi: "अधूरे दस्तावेज़" },
  { en: "DOB mismatch", hi: "जन्मतिथि मेल नहीं" },
];

const STEPS = [
  { key: "reason", label: "Reason", hi: "कारण" },
  { key: "check", label: "Check", hi: "जाँच" },
  { key: "documents", label: "Documents", hi: "दस्तावेज़" },
  { key: "review", label: "Review", hi: "समीक्षा" },
  { key: "submit", label: "Submit", hi: "जमा करें" },
];

export default function VerifyPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { user, claim, issues, resolveIssue, hasBlockingIssue } = useClaim();
  const [loading, setLoading] = useState(true);
  // Name mismatch is the signature issue — expand it by default per the design.
  const [expandedItem, setExpandedItem] = useState<string | null>("name_mismatch");
  const [showWhyWeCheck, setShowWhyWeCheck] = useState(false);
  const nameMismatchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(id);
  }, []);

  const unresolved = issues.filter((i) => !i.resolved);
  const nameMismatch = issues.find((i) => i.type === "name_mismatch");
  const bankLinked = user.bank.linked;

  const detectedPath = claim.claimPath ? CLAIM_PATHS[claim.claimPath] : null;

  function toggleExpand(item: string) {
    setExpandedItem(expandedItem === item ? null : item);
  }

  // Fix Now / Fix Name shortcut: always open the mismatch row and scroll to it.
  function fixName() {
    setExpandedItem("name_mismatch");
    requestAnimationFrame(() => {
      nameMismatchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <AppShell topBar={false}>
      <Header
        title={lang === "hi" ? "दावा सत्यापन" : "Verify Your Details"}
        onBack={() => router.push("/claim")}
      />
      <PageContainer className="flex flex-col gap-5 pt-5">
        {/* Title / header block — sticky so it stays visible while content scrolls */}
        <div className="sticky top-0 z-20 -mt-5 flex items-start justify-between gap-2 bg-canvas/95 pt-5 pb-3 backdrop-blur-md">
          <div className="flex items-start gap-2">
            <button
              onClick={() => router.push("/claim")}
              aria-label={lang === "hi" ? "वापस" : "Back"}
              className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface lg:inline-flex"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-ink">
                {lang === "hi" ? "अपना विवरण सत्यापित करें" : "Verify Your Details"}
              </h1>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">
                {lang === "hi"
                  ? "दावा तैयार करने से पहले कुछ चीजें ठीक करते हैं।"
                  : "Let's fix a few things before we prepare your claim."}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 lg:flex">
            <TopBarActions
              lang={lang}
              bankLinked={user.bank.linked}
              name={user.name}
              uan={user.uan}
              onLogout={() => router.push("/")}
            />
          </div>
        </div>

        {/* Progress stepper — Step 2 (Check) active in brand indigo */}
        <VerifyStepper current="check" lang={lang} />

        {/* Alert banner */}
        {unresolved.length > 0 && (
          <Card className="border-warning bg-warning/5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/15">
                  <AlertTriangle size={18} className="text-warning" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {lang === "hi"
                      ? `${unresolved.length} समस्या जिसे आपका ध्यान चाहिए`
                      : `${unresolved.length} issue${unresolved.length > 1 ? "s" : ""} need${unresolved.length === 1 ? "s" : ""} your attention`}
                  </p>
                  <p className="text-xs text-muted">
                    {lang === "hi"
                      ? "दावा अस्वीकृति से बचने के लिए इसे ठीक करें।"
                      : "Fix this to avoid claim rejection."}
                  </p>
                </div>
              </div>
              <button
                onClick={fixName}
                className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
              >
                {lang === "hi" ? "अभी ठीक करें" : "Fix Now"}
              </button>
            </div>
          </Card>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          {/* Main column */}
          <div className="space-y-4">
            {/* Details Verification section */}
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink">
                    {lang === "hi" ? "विवरण सत्यापन" : "Details Verification"}
                  </h2>
                  <p className="text-sm text-muted">
                    {lang === "hi"
                      ? "हम आपके विवरण की हमारे रिकॉर्ड से जाँच कर रहे हैं।"
                      : "We're checking your details with our records."}
                  </p>
                </div>
                <button
                  onClick={() => setShowWhyWeCheck((v) => !v)}
                  aria-expanded={showWhyWeCheck}
                  className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary"
                >
                  {lang === "hi" ? "हम क्यों जाँचते हैं?" : "Why we check?"}
                  <Info size={14} />
                </button>
              </div>

              {showWhyWeCheck && (
                <div className="mb-4 animate-fade-in rounded-xl bg-canvas px-4 py-3">
                  <p className="text-sm leading-relaxed text-muted">
                    {lang === "hi"
                      ? "EPFO कई दावों को केवल इसलिए अस्वीकार करता है क्योंकि आधार, UAN और बैंक रिकॉर्ड में विवरण मेल नहीं खाते। हम जमा करने से पहले इन्हें जाँचते हैं ताकि आपका दावा बिना देरी के आगे बढ़े।"
                      : "EPFO rejects many claims simply because details in Aadhaar, UAN and bank records don't match. We check these before you file, so your claim moves forward without delay."}
                  </p>
                </div>
              )}

              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Aadhaar */}
                  <VerificationRow
                    icon={Fingerprint}
                    label={lang === "hi" ? "आधार विवरण" : "Aadhaar Details"}
                    sub={lang === "hi" ? "UAN से लिंक" : "Linked with UAN"}
                    status="verified"
                    expanded={expandedItem === "aadhaar"}
                    onToggle={() => toggleExpand("aadhaar")}
                    lang={lang}
                  />

                  {/* PAN */}
                  <VerificationRow
                    icon={CreditCard}
                    label={lang === "hi" ? "PAN विवरण" : "PAN Details"}
                    sub={lang === "hi" ? "PAN सक्रिय और वैध है" : "PAN is active and valid"}
                    status="verified"
                    expanded={expandedItem === "pan"}
                    onToggle={() => toggleExpand("pan")}
                    lang={lang}
                  />

                  {/* Name Match - the signature issue (accent / action required) */}
                  <div
                    ref={nameMismatchRef}
                    className="overflow-hidden rounded-xl border border-accent bg-accent/5"
                  >
                    <button
                      onClick={() => toggleExpand("name_mismatch")}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                        <User size={18} className="text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium text-ink">
                          {lang === "hi" ? "नाम मिलान" : "Name Match"}
                        </p>
                        <p className="text-xs text-muted">
                          {lang === "hi"
                            ? "आधार और UAN नाम में अंतर पाया गया"
                            : "Aadhaar and UAN name mismatch found"}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        <AlertTriangle size={12} />
                        {lang === "hi" ? "कार्य आवश्यक" : "Action Required"}
                      </span>
                      {expandedItem === "name_mismatch" ? (
                        <ChevronUp size={16} className="shrink-0 text-muted" />
                      ) : (
                        <ChevronDown size={16} className="shrink-0 text-muted" />
                      )}
                    </button>

                    {expandedItem === "name_mismatch" && (
                      <div className="animate-[fade-in_0.2s_ease-out] border-t border-accent/20 px-4 py-5">
                        <p className="mb-3 text-sm text-muted">
                          {lang === "hi"
                            ? "आपका नाम आधार और UAN में अलग है। यह दावा अस्वीकृति के प्रमुख कारणों में से एक है।"
                            : "Your name is different in Aadhaar and UAN. This is one of the top reasons for claim rejection."}
                        </p>
                        <div className="mb-3 flex items-center gap-4">
                          <div className="flex-1 rounded-xl bg-surface p-3 text-center">
                            <p className="text-xs text-muted">Aadhaar</p>
                            <p className="text-sm font-bold text-ink">{user.aadhaar_name}</p>
                          </div>
                          <span className="text-2xl font-bold text-accent">≠</span>
                          <div className="flex-1 rounded-xl bg-surface p-3 text-center">
                            <p className="text-xs text-muted">UAN</p>
                            <p className="text-sm font-bold text-ink">{user.uan_name}</p>
                          </div>
                        </div>
                        <div className="mb-3 rounded-xl bg-surface p-3">
                          <p className="flex items-start gap-2 text-sm text-muted">
                            <Info size={14} className="mt-0.5 shrink-0 text-primary" />
                            {lang === "hi"
                              ? "अपना UAN नाम आधार से मिलाना देरी से बचने में मदद करेगा।"
                              : "Updating your UAN name to match Aadhaar will help avoid delays."}
                          </p>
                        </div>
                        {!nameMismatch?.resolved ? (
                          <button
                            onClick={() => resolveIssue("name_mismatch")}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-base font-medium text-white transition-colors hover:bg-brand-dark"
                          >
                            {lang === "hi" ? "अभी नाम ठीक करें" : "Fix Name Now"}
                            <ArrowRight size={16} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
                            <CheckCircle2 size={16} />
                            {lang === "hi" ? "नाम ठीक कर दिया गया है।" : "Name has been fixed."}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bank Account */}
                  <VerificationRow
                    icon={Building2}
                    label={lang === "hi" ? "बैंक खाता" : "Bank Account"}
                    sub={
                      bankLinked
                        ? lang === "hi"
                          ? "खाता UAN से जुड़ा है"
                          : "Account linked with UAN"
                        : lang === "hi"
                          ? "खाता UAN से नहीं जुड़ा"
                          : "Account not seeded with UAN"
                    }
                    status={bankLinked ? "verified" : "error"}
                    expanded={expandedItem === "bank"}
                    onToggle={() => toggleExpand("bank")}
                    lang={lang}
                  />

                  {/* Mobile Number */}
                  <VerificationRow
                    icon={Smartphone}
                    label={lang === "hi" ? "मोबाइल नंबर" : "Mobile Number"}
                    sub={lang === "hi" ? "EPFO से सत्यापित" : "Verified with EPFO"}
                    status="verified"
                    expanded={expandedItem === "mobile"}
                    onToggle={() => toggleExpand("mobile")}
                    lang={lang}
                  />

                  {/* Email ID */}
                  <VerificationRow
                    icon={Mail}
                    label={lang === "hi" ? "ईमेल आईडी" : "Email ID"}
                    sub={lang === "hi" ? "सत्यापित" : "Verified"}
                    status="verified"
                    expanded={expandedItem === "email"}
                    onToggle={() => toggleExpand("email")}
                    lang={lang}
                  />
                </div>
              )}
            </Card>

            {/* Why fixing matters */}
            <Card className="border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <CheckCircle2 size={22} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-ink">
                    {lang === "hi" ? "इन समस्याओं को ठीक क्यों करें?" : "Why fixing these issues matters?"}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {lang === "hi"
                      ? "छोटे-मोटे मिलान या विवरण में कमी आपके दावे में देरी कर सकती है या अस्वीकृति भी कर सकती है।"
                      : "Small mismatches or missing details can delay your claim or even cause rejection."}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right sidebar — sticky so it doesn't force blank scroll space */}
          <div className="hidden space-y-4 lg:sticky lg:top-24 lg:block lg:self-start">
            {/* Claim Summary */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "आपका दावा सारांश" : "Your Claim Summary"}
              </h3>
              <div className="space-y-3">
                <SummaryRow label={lang === "hi" ? "दावा प्रकार" : "Claim Type"} value={detectedPath?.label ?? "—"} />
                <SummaryRow label={lang === "hi" ? "कारण" : "Reason"} value={claim.reasonText || "—"} />
                <SummaryRow label={lang === "hi" ? "वर्तमान में कार्यरत" : "Currently Working"} value={lang === "hi" ? "हाँ" : "Yes"} />
                <SummaryRow label={lang === "hi" ? "अपेक्षित भुगतान" : "Expected Payout"} value={rupee.format(user.balance)} highlight />
                <SummaryRow label={lang === "hi" ? "अनुमानित समय" : "Est. timeline"} value={lang === "hi" ? "बदलता रहता है" : "Varies"} />
              </div>
            </Card>

            {/* Common issues — orange dots */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "सामान्य समस्याएँ" : "Common issues we check"}
              </h3>
              <ul className="space-y-2.5">
                {COMMON_ISSUES.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {lang === "hi" ? issue.hi : issue.en}
                  </li>
                ))}
              </ul>
            </Card>

            {/* We are here to help */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "हम मदद के लिए हैं" : "We are here to help"}
              </h3>
              <div className="space-y-2">
                <HelpRow icon={MessageSquare} title={lang === "hi" ? "लाइव चैट" : "Live Chat"} sub={lang === "hi" ? "सहायक से चैट करें" : "Chat with assistant"} />
                <HelpRow icon={Phone} title={lang === "hi" ? "कॉल सपोर्ट" : "Call Support"} sub={lang === "hi" ? "हमारी टीम से बात करें" : "Talk to our team"} />
                <HelpRow icon={BookOpen} title={lang === "hi" ? "सहायता केंद्र" : "Help Center"} sub={lang === "hi" ? "मार्गदर्शिकाएँ और FAQ" : "Guides & FAQs"} />
              </div>
            </Card>

            {/* Your data is secure */}
            <Card>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                  <Lock size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">
                    {lang === "hi" ? "आपका डेटा सुरक्षित है" : "Your data is secure"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {lang === "hi"
                      ? "हम आपकी जानकारी को सुरक्षित और निजी रखते हैं।"
                      : "We keep your information private and secure."}
                  </p>
                  <button className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                    {lang === "hi" ? "और जानें" : "Learn more"} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom actions — -mb-12 cancels PageContainer's trailing pb-12 so this can
            actually stick to the viewport bottom instead of detaching early. The
            warning line lives inside this same sticky block so nothing trails after it. */}
        <div className="sticky bottom-0 -mx-5 -mb-12 flex flex-col gap-2 border-t border-line bg-canvas/95 px-5 pb-5 pt-3 shadow-[0_-8px_24px_rgba(17,33,47,0.06)] backdrop-blur-md">
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/claim")}>
              {t("back")}
            </Button>
            {/* Native button so the brand (indigo) background applies reliably —
                cn() uses clsx without tailwind-merge, so it can't override the
                Button component's built-in bg-primary. */}
            <button
              className="inline-flex min-h-[48px] flex-1 select-none items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-base font-medium text-white transition-colors hover:bg-brand-dark active:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
              disabled={hasBlockingIssue}
              onClick={() => router.push("/claim/documents")}
              aria-disabled={hasBlockingIssue}
              title={hasBlockingIssue ? (lang === "hi" ? "पहले ऊपर दी गई समस्याएँ ठीक करें" : "Fix the issues above to continue") : undefined}
            >
              {hasBlockingIssue ? (
                <>
                  {lang === "hi" ? "समस्याएँ ठीक करें" : "Fix Issues to Continue"}
                  <AlertTriangle size={16} />
                </>
              ) : (
                <>
                  {lang === "hi" ? "दस्तावेज़ों पर जाएं" : "Continue to Documents"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
          {hasBlockingIssue && (
            <p className="text-center text-xs text-warning" role="alert">
              {lang === "hi" ? "कृपया ऊपर दी गई समस्याएँ पहले ठीक करें" : "Please fix the issues above before continuing"}
            </p>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}

/**
 * Progress stepper for the claim flow, styled with the brand (indigo)
 * palette for the active/completed steps to match the design reference.
 */
function VerifyStepper({ current, lang }: { current: string; lang: string }) {
  const activeIndex = STEPS.findIndex((s) => s.key === current);
  return (
    <ol className="flex items-center gap-1" aria-label="Progress">
      {STEPS.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <li key={s.key} className="flex flex-1 items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done && "bg-brand text-white",
                  active && "bg-brand-soft text-brand ring-2 ring-brand",
                  !done && !active && "border border-line bg-canvas text-muted"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("text-[11px]", active ? "font-medium text-ink" : "text-muted")}>
                {lang === "hi" ? s.hi : s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  "mt-[-14px] h-0.5 flex-1 rounded",
                  i < activeIndex ? "bg-brand" : "bg-line"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function VerificationRow({
  icon: Icon,
  label,
  sub,
  status,
  expanded,
  onToggle,
  lang,
}: {
  icon: any;
  label: string;
  sub: string;
  status: "verified" | "error" | "pending";
  expanded: boolean;
  onToggle: () => void;
  lang: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors ${status === "error" ? "border-warning bg-warning/5" : "border-line bg-surface/50"}`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status === "error" ? "bg-warning/10" : "bg-surface"}`}
        >
          <Icon size={18} className={status === "error" ? "text-warning" : "text-muted"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-ink">{label}</p>
          <p className="text-xs text-muted">{sub}</p>
        </div>
        {status === "verified" ? (
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <CheckCircle2 size={12} />
            {lang === "hi" ? "सत्यापित" : "Verified"}
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
            <AlertTriangle size={12} />
            {lang === "hi" ? "लिंक नहीं" : "Not Linked"}
          </span>
        )}
        {expanded ? (
          <ChevronUp size={16} className="shrink-0 text-muted" />
        ) : (
          <ChevronDown size={16} className="shrink-0 text-muted" />
        )}
      </button>
      {expanded && (
        <div className="animate-fade-in border-t border-line px-4 py-3">
          <p className="text-sm leading-relaxed text-muted">
            {lang === "hi" ? `${label} सत्यापित और सक्रिय है।` : `${label} is verified and active.`}
          </p>
        </div>
      )}
    </div>
  );
}
