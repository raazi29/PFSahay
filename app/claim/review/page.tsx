"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { TopBarActions } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Stepper } from "@/components/ui/Stepper";
import { SummaryRow, ReviewField, CheckItem, HelpRow } from "@/components/ui/Helpers";
import { ErrorState } from "@/components/ui/Feedback";
import { useClaim } from "@/context/ClaimContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_USER } from "@/lib/mock-data/user";
import { CLAIM_PATHS, REASONS } from "@/lib/mock-data/claims";
import {
  CheckCircle2,
  Edit3,
  FileText,
  ArrowRight,
  Send,
  Search,
  Banknote,
  Lock,
  MessageSquare,
  Phone,
  BookOpen,
} from "lucide-react";

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const STEPS = [
  { key: "reason", label: "Reason" },
  { key: "check", label: "Check" },
  { key: "documents", label: "Documents" },
  { key: "review", label: "Review" },
  { key: "submit", label: "Submit" },
];

export default function ReviewPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { claim, user, submit, forceSubmitFail, issues, hasBlockingIssue } = useClaim();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const allRequiredDone = claim.documents.filter((d) => d.required).every((d) => d.uploaded);

  const path = claim.claimPath ? CLAIM_PATHS[claim.claimPath] : null;
  const reason = REASONS.find((r) => r.key === claim.reason);
  const reasonLabel = reason ? (lang === "hi" ? reason.labelHi : reason.label) : claim.reasonText;
  const docs = claim.documents.filter((d) => d.uploaded);

  function attemptSubmit() {
    if (!allRequiredDone) {
      setConfirm(false);
      toast(lang === "hi" ? "पहले सभी आवश्यक दस्तावेज़ अपलोड करें" : "Upload all required documents first", "error");
      router.push("/claim/documents");
      return;
    }
    if (hasBlockingIssue) {
      setConfirm(false);
      toast(lang === "hi" ? "कृपया पहले हाइलाइट की गई समस्याएँ ठीक करें" : "Fix the highlighted issues before submitting", "error");
      router.push("/claim/verify");
      return;
    }
    setConfirm(false);
    setErr(false);
    setBusy(true);
    setTimeout(() => {
      if (forceSubmitFail) {
        setBusy(false);
        setErr(true);
        return;
      }
      submit();
      router.push("/claim/submitted");
    }, 600);
  }

  return (
    <AppShell topBar={false}>
      <Header
        title={lang === "hi" ? "दावा समीक्षा" : "Review Your Claim"}
        onBack={() => router.push("/claim/documents")}
      />
      <PageContainer className="flex flex-col gap-5 pt-5">
        {/* Mobile progress indicator */}
        <div className="lg:hidden">
          <Stepper steps={STEPS} current="review" />
        </div>

        {/* Title — sticky so it stays visible while content scrolls */}
        <div className="sticky top-0 z-20 -mt-5 flex items-start justify-between gap-2 bg-canvas/95 pt-5 pb-3 backdrop-blur-md">
          <div>
            <h1 className="text-[24px] font-bold text-ink tracking-tight">
              {lang === "hi" ? "अपना दावा समीक्षा करें" : "Review Your Claim"}
            </h1>
            <p className="mt-1 text-[15px] text-muted leading-relaxed">
              {lang === "hi"
                ? "सबमिट करने से पहले सभी विवरण जांच लें।"
                : "Please review all details before we submit your claim."}
            </p>
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

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Everything looks good banner */}
            <Card className="border-success/30 bg-success/5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-ink">
                    {lang === "hi" ? "सब कुछ ठीक लग रहा है!" : "Everything looks good!"}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {lang === "hi"
                      ? "हमने आपके द्वारा दिए गए विवरण के आधार पर आपका दावा तैयार किया है।"
                      : "We've prepared your claim based on the information you provided."}
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 1: Claim Details */}
            <ReviewSection
              number={1}
              title={lang === "hi" ? "दावा विवरण" : "Claim Details"}
              onEdit={() => router.push("/claim")}
              lang={lang}
            >
              <div className="grid grid-cols-2 gap-4">
                <ReviewField label={lang === "hi" ? "दावा प्रकार" : "Claim Type"} value={path?.label ?? "—"} highlight />
                <ReviewField label={lang === "hi" ? "अपेक्षित भुगतान" : "Expected Payout"} value={rupee.format(user.balance)} highlight />
                <ReviewField label={lang === "hi" ? "कारण" : "Reason"} value={reasonLabel || "—"} />
                <ReviewField label={lang === "hi" ? "अनुमानित समय" : "Est. Timeline"} value={lang === "hi" ? "बदलता रहता है" : "Varies"} />
                <ReviewField label={lang === "hi" ? "वर्तमान में कार्यरत" : "Currently Working"} value={lang === "hi" ? "हाँ" : "Yes"} />
                <ReviewField label={lang === "hi" ? "संदर्भ" : "Reference"} value={lang === "hi" ? "सबमिट के बाद बनेगा" : "Will be generated"} />
              </div>
            </ReviewSection>

            {/* Section 2: Personal & Employment */}
            <ReviewSection
              number={2}
              title={lang === "hi" ? "व्यक्तिगत और रोज़गार विवरण" : "Personal & Employment Details"}
              onEdit={() => router.push("/claim/verify")}
              lang={lang}
            >
              <div className="grid grid-cols-2 gap-4">
                <ReviewField label={lang === "hi" ? "नाम" : "Name"} value={user.name} />
                <ReviewField label="PAN" value={user.pan} />
                <ReviewField label="UAN" value={user.uan} />
                <ReviewField label={lang === "hi" ? "वर्तमान नियोक्ता" : "Current Employer"} value={user.current_employer} />
                <ReviewField label="Aadhaar" value={`XXXX XXXX ${user.aadhaar_last4}`} />
                <ReviewField label={lang === "hi" ? "निकासी की तिथि" : "Date of Exit / Relieving"} value={user.date_of_exit} />
              </div>
            </ReviewSection>

            {/* Section 3: Bank Details */}
            <ReviewSection
              number={3}
              title={lang === "hi" ? "बैंक विवरण" : "Bank Details"}
              onEdit={() => router.push("/claim/verify")}
              lang={lang}
            >
              <div className="grid grid-cols-2 gap-4">
                <ReviewField label={lang === "hi" ? "बैंक नाम" : "Bank Name"} value={user.bank.name} />
                <ReviewField label="IFSC Code" value={user.bank.ifsc} />
                <ReviewField label={lang === "hi" ? "खाता संख्या" : "Account Number"} value={user.bank.account} />
                <ReviewField label={lang === "hi" ? "खाता प्रकार" : "Account Type"} value={lang === "hi" ? "बचत खाता" : user.bank.type} />
              </div>
              {user.bank.linked && (
                <div className="mt-3 rounded-xl bg-success/10 px-4 py-2 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span className="text-sm text-success font-medium">
                    {lang === "hi"
                      ? "आपका बैंक खाता लिंक और सत्यापित है।"
                      : "Your bank account is linked and verified."}
                  </span>
                </div>
              )}
            </ReviewSection>

            {/* Section 4: Uploaded Documents */}
            <ReviewSection
              number={4}
              title={lang === "hi" ? "अपलोड किए गए दस्तावेज़" : "Uploaded Documents"}
              onEdit={() => router.push("/claim/documents")}
              lang={lang}
            >
              <div className="space-y-2">
                {docs.length ? (
                  docs.map((d) => (
                    <div key={d.id} className="flex items-center gap-3 py-2">
                      <FileText size={16} className="text-muted" />
                      <span className="flex-1 text-sm font-medium text-ink">{d.label}</span>
                      <span className="text-xs text-success font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {lang === "hi" ? "अपलोड" : "Uploaded"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">—</p>
                )}
              </div>
              <p className="mt-3 text-xs text-muted flex items-center gap-1.5">
                <Lock size={12} />
                {lang === "hi"
                  ? "सभी दस्तावेज़ एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत हैं।"
                  : "All documents are encrypted and securely stored."}
              </p>
            </ReviewSection>

            {/* What happens next */}
            <Card className="border-primary/20 bg-primary/5">
              <h3 className="mb-4 text-base font-bold text-ink">
                {lang === "hi" ? "अगला क्या होता है?" : "What happens next?"}
              </h3>
              <div className="flex items-start justify-between gap-1 sm:gap-2">
                <NextStep
                  icon={Send}
                  label={lang === "hi" ? "सबमिट के बाद" : "After submit"}
                  sub={lang === "hi" ? "EPFO को भेजा जाता है" : "Sent to EPFO"}
                />
                <ArrowRight size={16} className="mt-3 shrink-0 text-primary/30" />
                <NextStep
                  icon={Search}
                  label={lang === "hi" ? "सत्यापन" : "Verification"}
                  sub={lang === "hi" ? "EPFO जाँच करता है" : "EPFO reviews"}
                />
                <ArrowRight size={16} className="mt-3 shrink-0 text-primary/30" />
                <NextStep
                  icon={Banknote}
                  label={lang === "hi" ? "स्वीकृति" : "Approval"}
                  sub={lang === "hi" ? "बैंक में भुगतान" : "Paid to bank"}
                />
              </div>
            </Card>

            {/* Error */}
            {err && (
              <ErrorState
                title={t("errorTitle")}
                body={t("submitFailed")}
                onRetry={attemptSubmit}
                retryLabel={t("retry")}
              />
            )}
          </div>

          {/* Right sidebar — sticky so it doesn't force blank scroll space */}
          <div className="space-y-4 hidden lg:sticky lg:top-24 lg:block lg:self-start">
            {/* Claim Summary */}
            <Card>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide mb-3">
                {lang === "hi" ? "आपका दावा सारांश" : "Your Claim Summary"}
              </h3>
              <div className="text-center mb-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <FileText size={24} className="text-primary" />
                </div>
              </div>
              <div className="space-y-3">
                <SummaryRow label={lang === "hi" ? "दावा प्रकार" : "Claim Type"} value={path?.label ?? "—"} />
                <SummaryRow label={lang === "hi" ? "कारण" : "Reason"} value={reasonLabel || "—"} />
                <SummaryRow label={lang === "hi" ? "अपेक्षित भुगतान" : "Expected Payout"} value={rupee.format(user.balance)} highlight />
              </div>
            </Card>

            {/* Checklist */}
            <Card>
              <div className="space-y-3">
                <CheckItem label={lang === "hi" ? "पात्रता" : "Eligibility"} sub={lang === "hi" ? "पात्र" : "Eligible"} />
                <CheckItem label={lang === "hi" ? "KYC सत्यापित" : "KYC Verified"} sub="Yes" />
                <CheckItem label={lang === "hi" ? "दस्तावेज़" : "Documents"} sub={`${docs.length} of 3 ${lang === "hi" ? "अपलोड" : "Uploaded"}`} />
                <CheckItem label={lang === "hi" ? "सबमिट के लिए तैयार" : "Ready to Submit"} sub="Yes" />
              </div>
            </Card>

            {/* Need help */}
            <Card>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide mb-3">
                {lang === "hi" ? "मदद चाहिए?" : "Need help?"}
              </h3>
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
                      ? "हम उद्योग मानक सुरक्षा प्रथाओं का पालन करते हैं।"
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

        {/* Actions — -mb-12 cancels PageContainer's trailing pb-12 so this can
            actually stick to the viewport bottom instead of detaching early. */}
        <div className="sticky bottom-0 -mx-5 -mb-12 flex gap-3 border-t border-line bg-canvas/95 px-5 pb-5 pt-3 shadow-[0_-8px_24px_rgba(17,33,47,0.06)] backdrop-blur-md">
          <Button variant="secondary" onClick={() => router.push("/claim/documents")}>
            {t("back")}
          </Button>
          <button
            type="button"
            disabled={busy}
            onClick={() => !busy && setConfirm(true)}
            className="inline-flex flex-1 select-none items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 min-h-[48px] text-base font-medium text-white transition-colors hover:bg-brand-dark active:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {lang === "hi" ? "सब कुछ ठीक है, दावा सबमिट करें" : "Everything Looks Good, Submit Claim"}
            <Send size={16} />
          </button>
        </div>
      </PageContainer>

      {/* Confirm modal */}
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title={t("reviewConfirmTitle")}
        footer={
          <>
            <Button variant="secondary" block onClick={() => setConfirm(false)}>
              {t("notNow")}
            </Button>
            <Button block onClick={attemptSubmit}>
              {t("reviewConfirm")}
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-muted">{t("reviewConfirmBody")}</p>
      </Modal>
    </AppShell>
  );
}

function ReviewSection({
  number,
  title,
  onEdit,
  lang,
  children,
}: {
  number: number;
  title: string;
  onEdit?: () => void;
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
            {number}
          </span>
          <h3 className="text-lg font-bold text-ink">{title}</h3>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-canvas transition-colors"
          >
            <Edit3 size={12} />
            {lang === "hi" ? "संपादित करें" : "Edit"}
          </button>
        )}
      </div>
      {children}
    </Card>
  );
}

function NextStep({
  icon: Icon,
  label,
  sub,
}: {
  icon: any;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Icon size={18} className="text-primary" />
      </div>
      <p className="text-xs font-semibold text-ink sm:text-sm leading-tight">{label}</p>
      <p className="text-[10px] text-muted sm:text-xs leading-tight">{sub}</p>
    </div>
  );
}
