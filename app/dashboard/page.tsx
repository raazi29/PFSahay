"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card, Section } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SummaryRow, HelpRow } from "@/components/ui/Helpers";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_USER } from "@/lib/mock-data/user";
import { cn } from "@/lib/cn";
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
  Sparkles,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Clock,
  Bell,
  ChevronDown,
  LogOut,
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
  const initials = u.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell>
      <PageContainer className="pt-6">
        {/* Greeting + top actions */}
        <div className="mb-6 flex items-start justify-between gap-4">
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
          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell lang={lang} bankLinked={u.bank.linked} />
            <UserMenu
              name={u.name}
              uan={u.uan}
              initials={initials}
              lang={lang}
              onLogout={() => router.push("/")}
            />
          </div>
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
                    {lang === "hi" ? "अपना PF क्लेम करने के लिए तैयार?" : "Ready to claim your PF?"}
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
                    <Sparkles size={12} className="text-brand" />
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
                  ? "हमारा AI हज़ारों नियम जाँचता है, सामान्य गलतियाँ पकड़ता है और एक स्वीकृत होने वाला दावा तैयार करने में मदद करता है।"
                  : "Our AI checks thousands of rules, catches common mistakes and helps you submit a claim that gets approved."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <FeatureBadge icon={ShieldCheck} label={lang === "hi" ? "स्मार्ट जाँच" : "Smarter Checks"} />
                <FeatureBadge icon={MessageSquare} label={lang === "hi" ? "सरल भाषा" : "Plain Language"} />
                <FeatureBadge icon={RefreshCw} label={lang === "hi" ? "लेटेस्ट स्थिति" : "Claim Status"} />
                <FeatureBadge icon={Sparkles} label={lang === "hi" ? "EPFO सदस्य" : "For EPFO Members"} />
              </div>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-muted">{t("demoDisclaimer")}</p>
      </PageContainer>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/* Dropdown helper — shared open state + outside-click / Escape close  */
/* ------------------------------------------------------------------ */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return { open, setOpen, ref };
}

const dotTone: Record<string, string> = {
  warning: "bg-warning",
  success: "bg-success",
  info: "bg-primary",
};

function NotificationBell({ lang, bankLinked }: { lang: string; bankLinked: boolean }) {
  const { open, setOpen, ref } = useDropdown();

  const items: { tone: "warning" | "success" | "info"; title: string; time: string }[] = [
    ...(!bankLinked
      ? [
          {
            tone: "warning" as const,
            title:
              lang === "hi"
                ? "दावा अस्वीकृति से बचने के लिए अपना बैंक खाता लिंक करें।"
                : "Link your bank account to avoid claim rejection.",
            time: lang === "hi" ? "अभी" : "Just now",
          },
        ]
      : []),
    {
      tone: "success" as const,
      title: lang === "hi" ? "आपका KYC सत्यापित हो गया है।" : "Your KYC has been verified.",
      time: lang === "hi" ? "2 घंटे पहले" : "2h ago",
    },
    {
      tone: "info" as const,
      title: lang === "hi" ? "आपकी PF पासबुक अपडेट हो गई है।" : "Your PF passbook was updated.",
      time: lang === "hi" ? "1 दिन पहले" : "1d ago",
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={lang === "hi" ? "सूचनाएं" : "Notifications"}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-primary/20 hover:text-ink"
      >
        <Bell size={18} />
        <span
          className={cn(
            "absolute right-2.5 top-2.5 h-2 w-2 rounded-full ring-2 ring-surface",
            bankLinked ? "bg-brand" : "bg-warning"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-72 rounded-2xl border border-line bg-surface p-2 shadow-card animate-fade-in"
        >
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {lang === "hi" ? "सूचनाएं" : "Notifications"}
          </p>
          <div className="space-y-0.5">
            {items.map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-canvas"
              >
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dotTone[n.tone])} />
                <div className="min-w-0">
                  <p className="text-sm leading-snug text-ink">{n.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserMenu({
  name,
  uan,
  initials,
  lang,
  onLogout,
}: {
  name: string;
  uan: string;
  initials: string;
  lang: string;
  onLogout: () => void;
}) {
  const { open, setOpen, ref } = useDropdown();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={lang === "hi" ? "उपयोगकर्ता मेनू" : "User menu"}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-1 pr-2 transition-colors hover:border-primary/20"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {initials}
        </span>
        <ChevronDown
          size={15}
          className={cn("text-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-60 rounded-2xl border border-line bg-surface p-2 shadow-card animate-fade-in"
        >
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="text-[11px] text-muted">UAN: {uan}</p>
            </div>
          </div>

          <div className="my-1 h-px bg-line" />

          <div className="space-y-0.5">
            <MenuItem
              icon={UserCircle}
              label={lang === "hi" ? "KYC और प्रोफ़ाइल" : "KYC & Profile"}
              onClick={() => setOpen(false)}
            />
            <MenuItem
              icon={BookOpen}
              label={lang === "hi" ? "पासबुक डाउनलोड करें" : "Download Passbook"}
              onClick={() => setOpen(false)}
            />
            <MenuItem
              icon={HelpCircle}
              label={lang === "hi" ? "सहायता" : "Support"}
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="my-1 h-px bg-line" />

          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
          >
            <LogOut size={15} />
            {lang === "hi" ? "लॉगआउट" : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-canvas"
    >
      <Icon size={15} className="text-muted" />
      {label}
    </button>
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

function FeatureBadge({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-line px-3 py-1.5 text-xs font-medium text-ink">
      <Icon size={13} className="text-primary" />
      {label}
    </span>
  );
}
