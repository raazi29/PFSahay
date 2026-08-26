"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UANInput } from "@/components/ui/Input";
import { OTPInput } from "@/components/ui/OTPInput";
import { SummaryRow, HelpRow } from "@/components/ui/Helpers";
import { useLanguage } from "@/context/LanguageContext";
import {
  Lock,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

const COMMON_ISSUES = [
  { en: "Name mismatch between Aadhaar and UAN", hi: "आधार और UAN के बीच नाम मिलान" },
  { en: "KYC not updated", hi: "KYC अपडेट नहीं" },
  { en: "Bank account not linked", hi: "बैंक खाता लिंक नहीं" },
  { en: "Incomplete documents", hi: "अधूरे दस्तावेज़" },
];

export default function LoginPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [step, setStep] = useState<"uan" | "otp">("uan");
  const [uan, setUan] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Grouped for readable display in the OTP confirmation, e.g. 1000 0000 0001
  const uanDisplay = uan.replace(/(.{4})(?=.)/g, "$1 ");

  function handleUan() {
    if (uan.length !== 12) {
      setError(t("invalidUan"));
      return;
    }
    setError(undefined);
    setStep("otp");
    setOtp("");
  }

  function handleOtp() {
    if (otp.length !== 6) {
      setError(t("otpInvalid"));
      return;
    }
    setError(undefined);
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 500);
  }

  function changeUan() {
    setStep("uan");
    setOtp("");
    setError(undefined);
  }

  function resendOtp() {
    setOtp("");
    setError(undefined);
  }

  return (
    <AppShell topBar={false}>
      <Header title={t("appName")} showLang={false} />
      <PageContainer className="pt-6 sm:pt-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-8">
          {/* ---------- Main form ---------- */}
          <div className="min-w-0">
            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-[28px] font-bold leading-tight tracking-tight text-ink">
                {lang === "hi" ? "UAN से लॉगिन करें" : "Login with UAN"}
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {lang === "hi"
                  ? "आपका UAN एक 12-अंकों का यूनिवर्सल अकाउंट नंबर है जो EPFO द्वारा जारी किया जाता है और आपके सभी PF खातों को जोड़ता है।"
                  : "Your UAN is a 12-digit Universal Account Number issued by EPFO that links all your PF accounts across employers."}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                <Lock size={12} className="shrink-0" />
                {lang === "hi" ? "कोई वास्तविक EPFO खाता कनेक्ट नहीं" : "No real EPFO account connected"}
              </p>
            </div>

            {/* Form card */}
            <Card>
              {step === "uan" ? (
                <>
                  <label htmlFor="uan" className="mb-1.5 block text-sm font-medium text-ink">
                    {t("uanLabel")}
                  </label>
                  <UANInput
                    value={uan}
                    onChange={(v) => {
                      setUan(v);
                      if (error) setError(undefined);
                    }}
                    error={error}
                  />
                  <Button block loading={loading} onClick={handleUan} className="mt-4 gap-2">
                    {t("continue")} <ArrowRight size={16} />
                  </Button>
                </>
              ) : (
                <>
                  {/* Which UAN we're verifying */}
                  <div className="mb-4 rounded-xl border border-line bg-canvas px-4 py-3">
                    <SummaryRow label={t("reviewUan")} value={uanDisplay} highlight />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[15px] font-semibold text-ink">{t("otpHeading")}</p>
                    <p className="text-sm text-muted">{t("otpSupport")}</p>
                  </div>

                  <div className="mt-4">
                    <OTPInput
                      value={otp}
                      onChange={(v) => {
                        setOtp(v);
                        if (error) setError(undefined);
                      }}
                      error={!!error}
                      disabled={loading}
                    />
                    {error && <p className="mt-2 text-sm text-danger">{error}</p>}
                  </div>

                  <Button block loading={loading} onClick={handleOtp} className="mt-4">
                    {t("otpCta")}
                  </Button>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={changeUan}
                      disabled={loading}
                      className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
                    >
                      <ArrowRight size={13} className="rotate-180" />
                      {lang === "hi" ? "UAN बदलें" : "Change UAN"}
                    </button>
                    <button
                      onClick={resendOtp}
                      disabled={loading}
                      className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      {t("otpResend")}
                    </button>
                  </div>
                </>
              )}
            </Card>

            {/* Demo mode warning banner — bottom of form */}
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-warning/20 bg-warning-soft px-4 py-3 text-warning">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed">{t("demoMode")}</p>
            </div>
          </div>

          {/* ---------- Right sidebar — sticky so it doesn't force blank scroll space ---------- */}
          <aside className="hidden space-y-4 lg:sticky lg:top-6 lg:block lg:self-start">
            {/* Common issues I prevent */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "सामान्य समस्याएँ जो मैं रोकता हूँ" : "Common issues I prevent"}
              </h3>
              <ul className="space-y-2.5">
                {COMMON_ISSUES.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                    <span className="leading-relaxed">{lang === "hi" ? issue.hi : issue.en}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Need help */}
            <Card>
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "मदद चाहिए?" : "Need help?"}
              </h3>
              <p className="mb-2 text-sm text-muted">
                {lang === "hi" ? "हम आपकी मदद के लिए यहाँ हैं।" : "We're here to help you through it."}
              </p>
              <div className="-mx-2">
                <HelpRow
                  icon={MessageSquare}
                  title={lang === "hi" ? "सहायक से चैट करें" : "Chat with the assistant"}
                  sub={lang === "hi" ? "तुरंत उत्तर पाएं" : "Get instant answers"}
                />
                <HelpRow
                  icon={HelpCircle}
                  title={lang === "hi" ? "सहायता केंद्र" : "Help Center"}
                  sub={lang === "hi" ? "गाइड और सामान्य प्रश्न" : "Guides & FAQs"}
                />
              </div>
            </Card>
          </aside>
        </div>
      </PageContainer>
    </AppShell>
  );
}
