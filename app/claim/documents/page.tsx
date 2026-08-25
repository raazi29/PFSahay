"use client";

import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import { SummaryRow, HelpRow } from "@/components/ui/Helpers";
import { UploadZone } from "@/components/documents/Upload";
import { useClaim } from "@/context/ClaimContext";
import { useLanguage } from "@/context/LanguageContext";
import { CLAIM_PATHS } from "@/lib/mock-data/claims";
import {
  FileText,
  Lightbulb,
  MessageSquare,
  Phone,
  BookOpen,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const STEP_DEFS = [
  { key: "reason", en: "Reason", hi: "कारण" },
  { key: "check", en: "Check", hi: "जाँच" },
  { key: "documents", en: "Documents", hi: "दस्तावेज़" },
  { key: "review", en: "Review", hi: "समीक्षा" },
  { key: "submit", en: "Submit", hi: "जमा" },
];

const TIPS = [
  { en: "Use a well-lit place", hi: "रोशनी वाली जगह का उपयोग करें" },
  { en: "All corners should be visible", hi: "सभी कोने दिखने चाहिए" },
  { en: "Avoid blur or glare", hi: "धुंधलापन या चकाचौंध से बचें" },
  { en: "File size should be less than 5MB", hi: "फ़ाइल का आकार 5MB से कम होना चाहिए" },
];

export default function DocumentsPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { claim, user, uploadDocument, removeDocument } = useClaim();

  const requiredDocs = claim.documents.filter((d) => d.required);
  const requiredUploaded = requiredDocs.filter((d) => d.uploaded).length;
  const requiredTotal = requiredDocs.length;
  const allRequired = requiredDocs.every((d) => d.uploaded);
  const detectedPath = claim.claimPath ? CLAIM_PATHS[claim.claimPath] : null;

  const steps = STEP_DEFS.map((s) => ({ key: s.key, label: lang === "hi" ? s.hi : s.en }));

  return (
    <AppShell topBar={false}>
      <Header
        title={lang === "hi" ? "दस्तावेज़ अपलोड" : "Upload Documents"}
        onBack={() => router.push("/claim/verify")}
      />
      <PageContainer className="flex flex-col gap-5 pt-5">
        {/* Title */}
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-primary">
            {lang === "hi" ? "दस्तावेज़ अपलोड करें" : "Upload Documents"}
          </h1>
          <p className="mt-1 text-[15px] leading-relaxed text-muted">
            {lang === "hi"
              ? "लगभग हो गया! अपने दावे के लिए आवश्यक दस्तावेज़ अपलोड करें।"
              : "Almost there! Upload the required documents for your claim."}
          </p>
        </div>

        {/* Stepper — Step 3 (Documents) active */}
        <Card className="py-4">
          <Stepper steps={steps} current="documents" />
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Why do we need these documents? */}
            <Card className="border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <FileText size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-primary">
                    {lang === "hi"
                      ? "हमें ये दस्तावेज़ क्यों चाहिए?"
                      : "Why do we need these documents?"}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {lang === "hi"
                      ? "ये दस्तावेज़ EPFO को आपकी पहचान सत्यापित करने और आपके दावे को बिना देरी के संसाधित करने में मदद करते हैं।"
                      : "These documents help EPFO verify your identity and process your claim without delays."}
                  </p>
                  <button className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    {lang === "hi" ? "और जानें" : "Learn more"} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </Card>

            {/* Documents Checklist */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">
                  {lang === "hi" ? "दस्तावेज़ जाँच सूची" : "Documents Checklist"}
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    allRequired ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}
                >
                  <CheckCircle2 size={12} />
                  {lang === "hi"
                    ? `${requiredTotal} में से ${requiredUploaded} आवश्यक अपलोड`
                    : `${requiredUploaded} of ${requiredTotal} required uploaded`}
                </span>
              </div>
              <div className="space-y-3">
                {claim.documents.map((doc) => (
                  <UploadZone
                    key={doc.id}
                    doc={doc}
                    onUploaded={(name) => uploadDocument(doc.id, name)}
                    onRemove={() => removeDocument(doc.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden space-y-4 lg:block">
            {/* Claim Summary */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
                {lang === "hi" ? "आपका दावा सारांश" : "Your Claim Summary"}
              </h3>
              <div className="space-y-3">
                <SummaryRow
                  label={lang === "hi" ? "दावा प्रकार" : "Claim Type"}
                  value={detectedPath?.label ?? "—"}
                />
                <SummaryRow
                  label={lang === "hi" ? "कारण" : "Reason"}
                  value={claim.reasonText || "—"}
                />
                <SummaryRow
                  label={lang === "hi" ? "वर्तमान में कार्यरत" : "Currently Working"}
                  value={lang === "hi" ? "हाँ" : "Yes"}
                />
                <SummaryRow
                  label={lang === "hi" ? "अपेक्षित भुगतान" : "Expected Payout"}
                  value={new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(user.balance)}
                  highlight
                />
              </div>
            </Card>

            {/* Tips for clear uploads */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
                {lang === "hi" ? "स्पष्ट अपलोड के लिए सुझाव" : "Tips for clear uploads"}
              </h3>
              <ul className="space-y-2.5">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <Lightbulb size={14} className="mt-0.5 shrink-0 text-accent" />
                    {lang === "hi" ? tip.hi : tip.en}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Need Help? */}
            <Card>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
                {lang === "hi" ? "मदद चाहिए?" : "Need Help?"}
              </h3>
              <p className="mb-3 text-sm text-muted">
                {lang === "hi"
                  ? "हम इसे आसान बनाने के लिए हैं।"
                  : "We're here to make this easy for you."}
              </p>
              <div className="space-y-2">
                <HelpRow
                  icon={MessageSquare}
                  title={lang === "hi" ? "लाइव चैट" : "Live Chat"}
                  sub={lang === "hi" ? "हमारे सहायक से चैट करें" : "Chat with our assistant"}
                />
                <HelpRow
                  icon={Phone}
                  title={lang === "hi" ? "कॉल सपोर्ट" : "Call Support"}
                  sub={lang === "hi" ? "हमारी टीम से बात करें" : "Talk to our team"}
                />
                <HelpRow
                  icon={BookOpen}
                  title={lang === "hi" ? "सहायता केंद्र" : "Help Center"}
                  sub={lang === "hi" ? "मार्गदर्शिकाएँ और FAQ" : "Guides & FAQs"}
                />
              </div>
            </Card>

            {/* Your data is safe */}
            <Card>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Lock size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">
                    {lang === "hi" ? "आपका डेटा सुरक्षित है" : "Your data is safe"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {lang === "hi"
                      ? "हम आपकी जानकारी को सुरक्षित और निजी रखते हैं।"
                      : "We keep your information private and secure."}
                  </p>
                  <button className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    {lang === "hi" ? "और जानें" : "Learn more"} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-line bg-canvas/95 px-5 pb-5 pt-3 shadow-[0_-8px_24px_rgba(17,33,47,0.06)] backdrop-blur-md">
          <Button variant="secondary" onClick={() => router.push("/claim/verify")}>
            {t("back")}
          </Button>
          <Button
            className="flex-1 gap-2 !bg-brand text-white hover:!bg-brand-dark active:!bg-brand-dark focus-visible:!ring-brand"
            disabled={!allRequired}
            onClick={() => router.push("/claim/review")}
            aria-disabled={!allRequired}
            title={
              !allRequired
                ? lang === "hi"
                  ? "सभी आवश्यक दस्तावेज़ अपलोड करें"
                  : "Upload all required documents to continue"
                : undefined
            }
          >
            {lang === "hi" ? "दावा समीक्षा करें" : "Review Claim"}
            <ArrowRight size={16} />
          </Button>
        </div>
        {!allRequired && (
          <p className="text-center text-xs text-warning" role="alert">
            {t("docsRequired")}
          </p>
        )}

        <p className="text-center text-xs text-muted">{t("demoDisclaimer")}</p>
      </PageContainer>
    </AppShell>
  );
}
