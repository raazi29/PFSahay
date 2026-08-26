"use client";

import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { TopBarActions } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card, Section } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SummaryRow, HelpRow } from "@/components/ui/Helpers";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_USER } from "@/lib/mock-data/user";
import {
  ArrowRight,
  Wallet,
  Calendar,
  CheckCircle2,
  BarChart3,
  Upload,
  UserCircle,
  BookOpen,
  HelpCircle,
  Shield,
  ShieldCheck,
  Clock,
} from "lucide-react";

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function DashboardPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const u = MOCK_USER;

  const firstName = u.name.split(" ")[0];

  return (
    <AppShell>
      <PageContainer className="pt-6">
        {/* Greeting + top actions — sticky so it stays visible while content scrolls */}
        <div className="sticky top-0 z-20 -mt-6 mb-6 flex items-start justify-between gap-4 bg-canvas/95 pt-6 pb-3 backdrop-blur-md">
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold text-ink tracking-tight">
              {lang === "hi" ? "नमस्ते" : "Good morning"}, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {lang === "hi"
                ? "चलो आपका PF क्लेम करते हैं।"
                : "Let's get your PF claim done, the right way."}
            </p>
          </div>
          <TopBarActions
            lang={lang}
            bankLinked={u.bank.linked}
            name={u.name}
            uan={u.uan}
            onLogout={() => router.push("/")}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Balance card */}
            <Card className="bg-gradient-to-br from-primary to-primary-ink text-white overflow-hidden">
              <div className="relative">
                <p className="text-sm/relaxed text-white/80">{t("balanceLabel")}</p>
                <p className="mt-1 text-4xl font-bold tracking-tight">
                  {rupee.format(u.balance)}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {lang === "hi" ? "कुल बैलेंस" : "Total Balance"}
                </p>
                <p className="mt-2 text-xs text-white/60">
                  {lang === "hi" ? `अंतिम अपडेट: ${u.lastUpdated}` : `Last updated: ${u.lastUpdated}`}
                </p>
                <div className="absolute right-4 top-2 opacity-15">
                  <Wallet size={56} strokeWidth={1} />
                </div>
              </div>
              {/* Breakdown */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/20 pt-4">
                <div>
                  <p className="text-[11px] text-white/70">
                    {lang === "hi" ? "कर्मचारी हिस्सा" : "Employee Share"}
                  </p>
                  <p className="text-sm font-bold">{rupee.format(u.shares.employee)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/70">
                    {lang === "hi" ? "नियोक्ता हिस्सा" : "Employer Share"}
                  </p>
                  <p className="text-sm font-bold">{rupee.format(u.shares.employer)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/70">
                    {lang === "hi" ? "पेंशन (EPS)" : "Pension (EPS)"}
                  </p>
                  <p className="text-sm font-bold">{rupee.format(u.shares.pension)}</p>
                </div>
              </div>
            </Card>

            {/* Ready to claim CTA */}
            <Card className="border-brand/20 bg-brand/5">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-ink">
                    {lang === "hi" ? "अपना दावा शुरू करें" : "Start your claim"}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {lang === "hi"
                      ? "कुछ सरल सवालों के जवाब दें और हम आपको सही प्रक्रिया में मार्गदर्शन करेंगे।"
                      : "Answer a few simple questions and we'll guide you through the correct process."}
                  </p>
                  <Button
                    className="mt-4 gap-2 !bg-brand hover:!bg-brand-dark active:!bg-brand-dark"
                    onClick={() => router.push("/claim")}
                  >
                    {t("claimCta")}
                    <ArrowRight size={15} />
                  </Button>
                  <p className="mt-2 text-xs text-muted flex items-center gap-1.5">
                    <Clock size={12} className="text-brand" />
                    {lang === "hi" ? "5 मिनट से कम में" : "Takes less than 5 minutes"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Shield size={24} className="text-brand" />
                </div>
              </div>
            </Card>

            {/* Employment history */}
            <Section
              title={lang === "hi" ? "रोज़गार इतिहास" : "EMPLOYMENT HISTORY"}
              subtitle={lang === "hi" ? undefined : "View all"}
            >
              <Card className="divide-y divide-line py-0">
                {u.employment_history.map((h, i) => (
                  <div key={h.memberId} className="flex items-start gap-3 px-4 py-4">
                    <div className="mt-0.5 flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                          i === 0 ? "bg-success text-white" : "bg-line text-muted"
                        }`}
                      >
                        {i === 0 ? <CheckCircle2 size={16} /> : <span aria-hidden className="h-2 w-2 rounded-full bg-muted/40" />}
                      </div>
                      {i < u.employment_history.length - 1 && (
                        <div className="mt-1 h-8 w-0.5 bg-line" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-medium text-ink truncate">{h.employer}</p>
                        {i === 0 && (
                          <Badge tone="success">
                            {lang === "hi" ? "वर्तमान" : "Current"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted">{h.memberId}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                        <Calendar size={12} />
                        <span>{h.from} – {h.to}</span>
                        <span className="ml-auto">{h.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
              <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                {lang === "hi" ? "पूरा इतिहास देखें" : "View full employment history"} <ArrowRight size={13} />
              </button>
            </Section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* KYC Status */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                  {t("kycLabel")}
                </h3>
                <button className="text-xs font-medium text-primary hover:underline">
                  {lang === "hi" ? "सभी देखें" : "View all"}
                </button>
              </div>
              <div className="space-y-3">
                <KycRow label="Aadhaar" verified={u.kyc.aadhaar} />
                <KycRow label="PAN" verified={u.kyc.pan} />
                <KycRow label={lang === "hi" ? "बैंक खाता" : "Bank Account"} verified={u.bank.linked} />
                <KycRow label={lang === "hi" ? "मोबाइल नंबर" : "Mobile Number"} verified={u.kyc.mobile ?? true} />
                <KycRow label={lang === "hi" ? "ईमेल आईडी" : "Email ID"} verified={u.kyc.email ?? true} />
              </div>
              {!u.bank.linked && (
                <div className="mt-4 rounded-xl bg-warning/8 border border-warning/15 px-4 py-3">
                  <p className="text-sm text-warning">
                    {lang === "hi"
                      ? "दावा अस्वीकृति से बचने के लिए अपना बैंक खाता लिंक करें।"
                      : "Link your bank account to avoid claim rejection."}
                  </p>
                  <button className="mt-1 text-sm font-bold text-primary hover:underline">
                    {lang === "hi" ? "अभी लिंक करें" : "Link Now"}
                  </button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide mb-3">
                {lang === "hi" ? "त्वरित कार्य" : "QUICK ACTIONS"}
              </h3>
              <div className="space-y-1">
                <QuickAction
                  icon={BarChart3}
                  label={lang === "hi" ? "दावा स्थिति ट्रैक करें" : "Track Claim Status"}
                  sub={lang === "hi" ? "अपनी दावा प्रगति देखें" : "Check your claim progress"}
                  onClick={() => router.push("/claim/tracker")}
                />
                <QuickAction
                  icon={Upload}
                  label={lang === "hi" ? "दस्तावेज़ अपलोड करें" : "Upload Documents"}
                  sub={lang === "hi" ? "दस्तावेज़ अपलोड या प्रबंधित करें" : "Upload or manage documents"}
                  onClick={() => router.push("/claim/documents")}
                />
                <QuickAction
                  icon={UserCircle}
                  label={lang === "hi" ? "KYC अपडेट करें" : "Update KYC"}
                  sub={lang === "hi" ? "अपना विवरण अपडेट रखें" : "Keep your details up to date"}
                />
                <QuickAction
                  icon={BookOpen}
                  label={lang === "hi" ? "पासबुक डाउनलोड करें" : "Download Passbook"}
                  sub={lang === "hi" ? "पासबुक देखें या डाउनलोड करें" : "View or download passbook"}
                />
                <QuickAction
                  icon={HelpCircle}
                  label={lang === "hi" ? "प्रश्न उठाएं" : "Raise a Query"}
                  sub={lang === "hi" ? "सहायता से सहायता प्राप्त करें" : "Get help from support"}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* We've got your back */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-ink">
                {lang === "hi" ? "हम आपके साथ हैं" : "We've got your back"}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {lang === "hi"
                  ? "जमा करने से पहले हम आपके विवरण EPFO नियमों के आधार पर जाँचते हैं और सामान्य गलतियाँ पकड़ते हैं।"
                  : "Before you file, we check your details against EPFO rules and catch the mistakes that usually cause rejections."}
              </p>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-muted">{t("demoDisclaimer")}</p>
      </PageContainer>
    </AppShell>
  );
}

function KycRow({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[15px] text-ink">{label}</span>
      {verified ? (
        <Badge tone="success">
          <CheckCircle2 size={12} className="mr-1" />
          Verified
        </Badge>
      ) : (
        <Badge tone="warning">Not Linked</Badge>
      )}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  sub,
  onClick,
}: {
  icon: any;
  label: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all hover:border-primary/10 hover:bg-primary/5"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface transition-colors group-hover:bg-primary/10">
        <Icon size={16} className="text-muted group-hover:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <ArrowRight size={14} className="text-muted/50" />
    </button>
  );
}
