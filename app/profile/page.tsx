"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { TopBarActions } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_USER } from "@/lib/mock-data/user";
import { cn } from "@/lib/cn";
import {
  User,
  Smartphone,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Pencil,
  Copy,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Landmark,
  Briefcase,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type Tab = "profile" | "kyc" | "accounts";

export default function ProfilePage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const toast = useToast();
  const u = MOCK_USER;
  const [tab, setTab] = useState<Tab>("profile");

  const initials = u.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function notEditable() {
    toast(
      lang === "hi"
        ? "इस डेमो वातावरण में संपादन अक्षम है।"
        : "Editing is disabled in this demo environment.",
      "info"
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: lang === "hi" ? "प्रोफ़ाइल" : "Profile" },
    { key: "kyc", label: lang === "hi" ? "KYC सत्यापन" : "KYC Verification" },
    { key: "accounts", label: lang === "hi" ? "लिंक्ड खाते" : "Linked Accounts" },
  ];

  return (
    <AppShell topBar={false}>
      <Header title={lang === "hi" ? "प्रोफ़ाइल और KYC" : "Profile & KYC"} showLang={false} />
      <PageContainer className="pt-6">
        {/* Page header — sticky so it stays visible while content scrolls */}
        <div className="sticky top-0 z-20 -mt-6 mb-6 flex flex-wrap items-start justify-between gap-4 bg-canvas/95 pt-6 pb-3 backdrop-blur-md">
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold tracking-tight text-ink sm:text-[24px]">
              {lang === "hi" ? "प्रोफ़ाइल और KYC" : "Profile & KYC"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {lang === "hi"
                ? "PF दावों के लिए उपयोग किए जाने वाले आपके खाते और KYC विवरण।"
                : "Your account details and KYC information used for PF claims."}
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

        {/* Tabs */}
        <div className="mb-5 flex items-center gap-1 overflow-x-auto border-b border-line">
          {tabs.map((tItem) => (
            <button
              key={tItem.key}
              onClick={() => setTab(tItem.key)}
              className={cn(
                "-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors",
                tab === tItem.key
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent font-medium text-muted hover:text-ink"
              )}
            >
              {tItem.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Main column */}
          <div className="space-y-5">
            {tab === "profile" && (
              <>
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-ink">{u.name}</p>
                          <Badge tone="success">
                            <CheckCircle2 size={12} className="mr-1" />
                            {lang === "hi" ? "सत्यापित" : "Verified"}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">UAN: {u.uan}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="md" className="gap-1.5 shrink-0" onClick={notEditable}>
                      <Pencil size={14} />
                      {lang === "hi" ? "प्रोफ़ाइल संपादित करें" : "Edit Profile"}
                    </Button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-5 border-t border-line pt-5 sm:grid-cols-2">
                    <ProfileField
                      icon={User}
                      label={lang === "hi" ? "पूरा नाम" : "Full Name"}
                      value={u.name}
                    />
                    <ProfileField
                      icon={Smartphone}
                      label={lang === "hi" ? "मोबाइल नंबर" : "Mobile Number"}
                      value={u.mobile}
                      verified
                      lang={lang}
                    />
                    <ProfileField
                      icon={Calendar}
                      label={lang === "hi" ? "जन्म तिथि" : "Date of Birth"}
                      value={u.dob}
                    />
                    <ProfileField
                      icon={CreditCard}
                      label={lang === "hi" ? "पैन" : "PAN"}
                      value={u.pan}
                      verified
                      lang={lang}
                    />
                    <ProfileField
                      icon={Mail}
                      label={lang === "hi" ? "ईमेल आईडी" : "Email ID"}
                      value={u.email}
                    />
                    <ProfileField
                      icon={MapPin}
                      label={lang === "hi" ? "वर्तमान पता" : "Current Address"}
                      value={u.address}
                    />
                  </div>
                </Card>

                <KycCard u={u} lang={lang} />
              </>
            )}

            {tab === "kyc" && <KycCard u={u} lang={lang} standalone />}

            {tab === "accounts" && <LinkedAccountsCard u={u} lang={lang} />}
          </div>

          {/* Right sidebar */}
          <div className="hidden space-y-5 lg:block">
            <PfSummaryCard u={u} lang={lang} router={router} />
            <KycHealthCard lang={lang} />
            <UpdateKycCard lang={lang} onUpdate={notEditable} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">{t("demoDisclaimer")}</p>
      </PageContainer>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */

function ProfileField({
  icon: Icon,
  label,
  value,
  verified,
  lang,
}: {
  icon: any;
  label: string;
  value: string;
  verified?: boolean;
  lang?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          <p className="text-[15px] font-medium text-ink break-words">{value}</p>
          {verified && (
            <Badge tone="success">
              <CheckCircle2 size={11} className="mr-1" />
              {lang === "hi" ? "सत्यापित" : "Verified"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function KycCard({
  u,
  lang,
  standalone,
}: {
  u: typeof MOCK_USER;
  lang: string;
  standalone?: boolean;
}) {
  const verifiedOn = u.lastUpdated.split("•")[0].trim();
  const [openRow, setOpenRow] = useState<string | null>(null);

  const rows: { key: string; icon: any; label: string; detail: string; extra: string }[] = [
    {
      key: "aadhaar",
      icon: CreditCard,
      label: lang === "hi" ? "आधार कार्ड" : "Aadhaar Card",
      detail: `XXXX XXXX ${u.aadhaar_last4}`,
      extra:
        lang === "hi"
          ? "आपके दावों की पहचान सत्यापन के लिए उपयोग किया जाता है।"
          : "Used for identity verification on your claims.",
    },
    {
      key: "pan",
      icon: CreditCard,
      label: lang === "hi" ? "पैन कार्ड" : "PAN Card",
      detail: u.pan,
      extra:
        lang === "hi"
          ? "TDS गणना और कर अनुपालन के लिए उपयोग किया जाता है।"
          : "Used for TDS calculation and tax compliance.",
    },
    {
      key: "mobile",
      icon: Smartphone,
      label: lang === "hi" ? "मोबाइल नंबर" : "Mobile Number",
      detail: u.mobile,
      extra:
        lang === "hi"
          ? "OTP सत्यापन और सूचनाओं के लिए उपयोग किया जाता है।"
          : "Used for OTP verification and notifications.",
    },
    {
      key: "email",
      icon: Mail,
      label: lang === "hi" ? "ईमेल आईडी" : "Email ID",
      detail: u.email,
      extra:
        lang === "hi"
          ? "दावा अपडेट और रसीदें भेजने के लिए उपयोग किया जाता है।"
          : "Used to send claim updates and receipts.",
    },
    {
      key: "photo",
      icon: ShieldCheck,
      label: lang === "hi" ? "फोटो सत्यापन" : "Photo Verification",
      detail: lang === "hi" ? "सेल्फी सत्यापित" : "Selfie verified",
      extra:
        lang === "hi"
          ? "आधार फोटो के विरुद्ध चेहरे का मिलान सत्यापित किया गया।"
          : "Face match verified against your Aadhaar photo.",
    },
  ];

  return (
    <Card className="p-0">
      <div className="p-5 pb-0">
        <h2 className="text-base font-bold text-ink">
          {lang === "hi" ? "KYC सत्यापन" : "KYC Verification"}
        </h2>
        {standalone && (
          <p className="mt-1 text-sm text-muted">
            {lang === "hi"
              ? "सुचारू दावा प्रसंस्करण सुनिश्चित करने के लिए अपना KYC पूरा करें।"
              : "Complete your KYC to ensure smooth claim processing."}
          </p>
        )}
      </div>
      <div className="mt-4 divide-y divide-line">
        {rows.map((r) => {
          const Icon = r.icon;
          const open = openRow === r.key;
          return (
            <div key={r.key}>
              <button
                onClick={() => setOpenRow(open ? null : r.key)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-canvas"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-ink">{r.label}</p>
                  <p className="text-xs text-muted">{r.detail}</p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge tone="success">
                    <CheckCircle2 size={11} className="mr-1" />
                    {lang === "hi" ? "सत्यापित" : "Verified"}
                  </Badge>
                  <p className="mt-1 text-[11px] text-muted">
                    {lang === "hi" ? `${verifiedOn} को सत्यापित` : `Verified on ${verifiedOn}`}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className={cn("shrink-0 text-muted transition-transform", open && "rotate-90")}
                />
              </button>
              {open && (
                <div className="px-5 pb-4 pl-[3.25rem] text-sm text-muted">{r.extra}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="m-5 mt-4 flex items-start gap-2.5 rounded-xl bg-primary/5 px-4 py-3">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-xs text-muted">
          {lang === "hi"
            ? "आपके KYC विवरण एन्क्रिप्टेड और सुरक्षित हैं। हम कभी भी आपकी जानकारी साझा नहीं करते।"
            : "Your KYC details are encrypted and secure. We never share your information."}
        </p>
      </div>
    </Card>
  );
}

function LinkedAccountsCard({ u, lang }: { u: typeof MOCK_USER; lang: string }) {
  return (
    <div className="space-y-5">
      <Card className="p-0">
        <div className="p-5 pb-0">
          <h2 className="text-base font-bold text-ink">
            {lang === "hi" ? "नियोक्ता" : "Employer"}
          </h2>
        </div>
        <div className="mt-4 divide-y divide-line">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
              <Briefcase size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-ink">{u.current_employer}</p>
              <p className="text-xs text-muted">
                {lang === "hi" ? "वर्तमान नियोक्ता" : "Current employer"}
              </p>
            </div>
            <Badge tone="success">
              <CheckCircle2 size={11} className="mr-1" />
              {lang === "hi" ? "सक्रिय" : "Active"}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-0">
        <div className="p-5 pb-0">
          <h2 className="text-base font-bold text-ink">
            {lang === "hi" ? "बैंक खाता" : "Bank Account"}
          </h2>
        </div>
        <div className="mt-4 divide-y divide-line">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
              <Landmark size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-ink">{u.bank.name}</p>
              <p className="text-xs text-muted">
                {u.bank.account} • {u.bank.ifsc} • {u.bank.type}
              </p>
            </div>
            {u.bank.linked ? (
              <Badge tone="success">
                <CheckCircle2 size={11} className="mr-1" />
                {lang === "hi" ? "लिंक्ड" : "Linked"}
              </Badge>
            ) : (
              <Badge tone="warning">{lang === "hi" ? "लिंक नहीं है" : "Not Linked"}</Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function PfSummaryCard({
  u,
  lang,
  router,
}: {
  u: typeof MOCK_USER;
  lang: string;
  router: ReturnType<typeof useRouter>;
}) {
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);

  function copyUan() {
    navigator.clipboard.writeText(u.uan).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card>
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
        {lang === "hi" ? "PF खाता सारांश" : "PF Account Summary"}
      </h3>

      <div className="mt-3">
        <p className="text-xs text-muted">UAN</p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-lg font-bold tracking-tight text-ink">{u.uan}</p>
          <button
            onClick={copyUan}
            aria-label={lang === "hi" ? "UAN कॉपी करें" : "Copy UAN"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <p className="text-xs text-muted">{lang === "hi" ? "सदस्य बने" : "Member Since"}</p>
        <p className="text-sm font-medium text-ink">Mar 2018</p>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            {lang === "hi" ? "PF बैलेंस (सभी खाते)" : "PF Balance (All Accounts)"}
          </p>
          <button
            onClick={() => setHidden((h) => !h)}
            aria-label={lang === "hi" ? "बैलेंस दिखाएं/छुपाएं" : "Show/hide balance"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
        <p className="mt-0.5 text-xl font-bold tracking-tight text-primary">
          {hidden ? "••••••" : rupee.format(u.balance)}
        </p>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {lang === "hi" ? "खाता विवरण देखें" : "View account details"}
        <ArrowRight size={13} />
      </button>
    </Card>
  );
}

function KycHealthCard({ lang }: { lang: string }) {
  const pct = 100;
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <Card>
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
        {lang === "hi" ? "KYC स्वास्थ्य" : "KYC Health"}
      </h3>
      <div className="mt-4 flex flex-col items-center">
        <div className="relative flex h-[88px] w-[88px] items-center justify-center">
          <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
            <circle cx="44" cy="44" r={r} fill="none" stroke="currentColor" strokeWidth="7" className="text-line" />
            <circle
              cx="44"
              cy="44"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              className="text-success"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-ink">{pct}%</p>
            <p className="text-[10px] text-muted">{lang === "hi" ? "पूर्ण" : "Complete"}</p>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-muted">
          {lang === "hi"
            ? "बढ़िया! आपका KYC पूरा हो गया है। आप बिना किसी देरी के दावे दाखिल और संसाधित करने के लिए तैयार हैं।"
            : "Great! Your KYC is complete. You're all set to file and process claims without any delays."}
        </p>
      </div>
    </Card>
  );
}

function UpdateKycCard({ lang, onUpdate }: { lang: string; onUpdate: () => void }) {
  return (
    <Card className="border-brand/20 bg-brand/5">
      <h3 className="text-sm font-bold text-ink">
        {lang === "hi" ? "कुछ अपडेट करना है?" : "Need to update something?"}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {lang === "hi"
          ? "आप अपना KYC विवरण अपडेट कर सकते हैं और हम इसे तुरंत फिर से सत्यापित कर देंगे।"
          : "You can update your KYC details and we'll re-verify instantly."}
      </p>
      <Button variant="brand" size="md" block className="mt-4" onClick={onUpdate}>
        {lang === "hi" ? "KYC विवरण अपडेट करें" : "Update KYC Details"}
      </Button>
    </Card>
  );
}
