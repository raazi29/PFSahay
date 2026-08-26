"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Header, PageContainer } from "@/components/layout/AppShell";
import { TopBarActions } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_USER } from "@/lib/mock-data/user";
import { cn } from "@/lib/cn";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  Briefcase,
  ChevronRight,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Local mock data — this page only, not shared elsewhere              */
/* ------------------------------------------------------------------ */
type ClaimType = "full_settlement" | "partial_withdrawal" | "pf_transfer";
type ClaimStatus = "under_verification" | "approved" | "completed" | "withdrawn" | "rejected";

interface MockClaim {
  id: string;
  type: ClaimType;
  uan: string;
  status: ClaimStatus;
  submittedOn: string;
  lastUpdated: string;
}

const MOCK_CLAIMS: MockClaim[] = [
  {
    id: "PF-2025-05-24-64982",
    type: "full_settlement",
    uan: "1010 2345 6789",
    status: "under_verification",
    submittedOn: "24 May 2025",
    lastUpdated: "24 May 2025",
  },
  {
    id: "PF-2024-12-10-31120",
    type: "partial_withdrawal",
    uan: "1010 2345 6789",
    status: "approved",
    submittedOn: "12 Dec 2024",
    lastUpdated: "18 Dec 2024",
  },
  {
    id: "PF-2024-07-05-11809",
    type: "pf_transfer",
    uan: "1010 2345 6789",
    status: "completed",
    submittedOn: "05 Jul 2024",
    lastUpdated: "09 Jul 2024",
  },
  {
    id: "PF-2023-11-18-77821",
    type: "partial_withdrawal",
    uan: "1010 2345 6789",
    status: "withdrawn",
    submittedOn: "18 Nov 2023",
    lastUpdated: "18 Nov 2023",
  },
  {
    id: "PF-2023-03-14-55667",
    type: "full_settlement",
    uan: "1010 2345 6789",
    status: "rejected",
    submittedOn: "14 Mar 2023",
    lastUpdated: "20 Mar 2023",
  },
];

const TYPE_ICON: Record<ClaimType, any> = {
  full_settlement: Briefcase,
  partial_withdrawal: ArrowDownToLine,
  pf_transfer: ArrowLeftRight,
};

function typeLabel(type: ClaimType, lang: string) {
  if (type === "full_settlement") return lang === "hi" ? "पूर्ण PF निपटान" : "Full PF Settlement";
  if (type === "partial_withdrawal") return lang === "hi" ? "आंशिक निकासी" : "Partial Withdrawal";
  return lang === "hi" ? "PF स्थानांतरण" : "PF Transfer";
}

function statusLabel(status: ClaimStatus, lang: string) {
  switch (status) {
    case "under_verification":
      return lang === "hi" ? "सत्यापन के अधीन" : "Under Verification";
    case "approved":
      return lang === "hi" ? "स्वीकृत" : "Approved";
    case "completed":
      return lang === "hi" ? "पूर्ण" : "Completed";
    case "withdrawn":
      return lang === "hi" ? "वापस लिया गया" : "Withdrawn";
    case "rejected":
      return lang === "hi" ? "अस्वीकृत" : "Rejected";
  }
}

function statusNote(status: ClaimStatus, lang: string) {
  switch (status) {
    case "under_verification":
      return lang === "hi" ? "EPFO के पास" : "With EPFO";
    case "approved":
      return lang === "hi" ? "दावा स्वीकृत" : "Claim approved";
    case "completed":
      return lang === "hi" ? "राशि स्थानांतरित" : "Amount transferred";
    case "withdrawn":
      return lang === "hi" ? "उपयोगकर्ता द्वारा वापस लिया गया" : "Withdrawn by user";
    case "rejected":
      return lang === "hi" ? "दावा अस्वीकृत" : "Claim rejected";
  }
}

const statusTone: Record<ClaimStatus, "warning" | "success" | "danger"> = {
  under_verification: "warning",
  approved: "success",
  completed: "success",
  withdrawn: "danger",
  rejected: "danger",
};

type TabKey = "all" | "in_progress" | "completed" | "withdrawn";

function matchesTab(status: ClaimStatus, tab: TabKey) {
  if (tab === "all") return true;
  if (tab === "in_progress") return status === "under_verification" || status === "approved";
  if (tab === "completed") return status === "completed";
  return status === "withdrawn" || status === "rejected";
}

export default function ClaimsPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const u = MOCK_USER;

  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ClaimStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ClaimType>("all");

  const TABS: { key: TabKey; label: string }[] = [
    { key: "all", label: lang === "hi" ? "सभी दावे" : "All Claims" },
    { key: "in_progress", label: lang === "hi" ? "प्रगति में" : "In Progress" },
    { key: "completed", label: lang === "hi" ? "पूर्ण" : "Completed" },
    { key: "withdrawn", label: lang === "hi" ? "वापस लिया गया" : "Withdrawn" },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_CLAIMS.filter((c) => {
      if (!matchesTab(c.status, tab)) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (q) {
        const haystack = `${c.id} ${typeLabel(c.type, "en")} ${typeLabel(c.type, "hi")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [tab, statusFilter, typeFilter, search, lang]);

  return (
    <AppShell topBar={false}>
      <Header title={lang === "hi" ? "मेरे दावे" : "My Claims"} />
      <PageContainer className="pt-6">
        {/* Page header — sticky so it stays visible while content scrolls */}
        <div className="sticky top-0 z-20 -mt-6 mb-6 flex flex-wrap items-start justify-between gap-4 bg-canvas/95 pt-6 pb-3 backdrop-blur-md">
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-tight text-ink">
              {lang === "hi" ? "मेरे दावे" : "My Claims"}
            </h1>
            <p className="mt-1 text-[15px] text-muted">
              {lang === "hi"
                ? "अपने सभी PF दावों को एक ही जगह ट्रैक और प्रबंधित करें।"
                : "Track, manage and view all your PF claims in one place."}
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
            {/* Tabs */}
            <div className="flex items-center gap-5 overflow-x-auto border-b border-line">
              {TABS.map((tb) => (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={cn(
                    "shrink-0 border-b-2 px-1 pb-3 text-sm transition-colors",
                    tab === tb.key
                      ? "border-brand font-semibold text-brand"
                      : "border-transparent text-muted hover:text-ink"
                  )}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === "hi" ? "क्लेम ID या प्रकार खोजें" : "Search by Claim ID or type"}
                  className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-primary"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | ClaimStatus)}
                className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
              >
                <option value="all">{lang === "hi" ? "सभी स्थिति" : "All Status"}</option>
                <option value="under_verification">{statusLabel("under_verification", lang)}</option>
                <option value="approved">{statusLabel("approved", lang)}</option>
                <option value="completed">{statusLabel("completed", lang)}</option>
                <option value="withdrawn">{statusLabel("withdrawn", lang)}</option>
                <option value="rejected">{statusLabel("rejected", lang)}</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "all" | ClaimType)}
                className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
              >
                <option value="all">{lang === "hi" ? "सभी प्रकार" : "All Types"}</option>
                <option value="full_settlement">{typeLabel("full_settlement", lang)}</option>
                <option value="partial_withdrawal">{typeLabel("partial_withdrawal", lang)}</option>
                <option value="pf_transfer">{typeLabel("pf_transfer", lang)}</option>
              </select>

              <Button
                size="md"
                className="gap-1.5 sm:ml-auto"
                onClick={() => router.push("/claim")}
              >
                <Plus size={16} />
                {lang === "hi" ? "नया दावा शुरू करें" : "Start a new claim"}
              </Button>
            </div>

            {/* Claim list */}
            {filtered.length > 0 ? (
              <Card className="divide-y divide-line p-0">
                {filtered.map((c) => {
                  const Icon = TYPE_ICON[c.type];
                  return (
                    <div
                      key={c.id}
                      className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center"
                    >
                      {/* Icon + claim details */}
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Icon size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold text-ink">{c.id}</p>
                          <p className="text-sm text-muted">{typeLabel(c.type, lang)}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            {lang === "hi" ? "UAN" : "UAN"}: {c.uan}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex flex-row items-center gap-2 sm:w-44 sm:flex-col sm:items-start sm:gap-1">
                        <Badge tone={statusTone[c.status]}>{statusLabel(c.status, lang)}</Badge>
                        <p className="text-xs text-muted">{statusNote(c.status, lang)}</p>
                      </div>

                      {/* Dates */}
                      <div className="flex gap-6 sm:w-52">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted/70">
                            {lang === "hi" ? "जमा किया" : "Submitted"}
                          </p>
                          <p className="text-sm text-ink">{c.submittedOn}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted/70">
                            {lang === "hi" ? "अंतिम अपडेट" : "Last Updated"}
                          </p>
                          <p className="text-sm text-ink">{c.lastUpdated}</p>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="secondary"
                          size="md"
                          className="!min-h-0 !py-2 text-sm"
                          onClick={() => router.push("/claim/tracker")}
                        >
                          {lang === "hi" ? "विवरण देखें" : "View Details"}
                        </Button>
                        <ChevronRight size={16} className="hidden shrink-0 text-muted sm:block" />
                      </div>
                    </div>
                  );
                })}
              </Card>
            ) : (
              <Card className="py-10 text-center">
                <p className="text-sm text-muted">
                  {lang === "hi" ? "कोई दावा नहीं मिला।" : "No claims found."}
                </p>
              </Card>
            )}

            {/* Footer count */}
            <p className="text-center text-sm text-muted">
              {lang === "hi"
                ? `${MOCK_CLAIMS.length} में से ${filtered.length} दावे दिखाए जा रहे हैं`
                : `Showing ${filtered.length} of ${MOCK_CLAIMS.length} claims`}
            </p>
          </div>

          {/* Right sidebar — sticky so it doesn't force blank scroll space */}
          <div className="hidden space-y-5 lg:sticky lg:top-24 lg:block lg:self-start">
            {/* Know your claim */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "अपने दावे को समझें" : "Know your claim"}
              </h3>
              <div className="space-y-3">
                <StatusLegendRow
                  dot="bg-warning"
                  label={statusLabel("under_verification", lang)}
                  desc={
                    lang === "hi"
                      ? "आपका दावा EPFO द्वारा सत्यापित किया जा रहा है।"
                      : "Your claim is being verified by EPFO."
                  }
                />
                <StatusLegendRow
                  dot="bg-success"
                  label={statusLabel("approved", lang)}
                  desc={
                    lang === "hi"
                      ? "आपका दावा स्वीकृत हो गया है। राशि जल्द भेजी जाएगी।"
                      : "Your claim has been approved. Amount will be processed."
                  }
                />
                <StatusLegendRow
                  dot="bg-success"
                  label={statusLabel("completed", lang)}
                  desc={
                    lang === "hi"
                      ? "राशि आपके बैंक खाते में जमा कर दी गई है।"
                      : "Amount has been credited to your bank account."
                  }
                />
                <StatusLegendRow
                  dot="bg-danger"
                  label={lang === "hi" ? "अस्वीकृत / वापस लिया गया" : "Rejected / Withdrawn"}
                  desc={
                    lang === "hi"
                      ? "दावा अस्वीकृत किया गया या वापस ले लिया गया।"
                      : "Claim was rejected or withdrawn."
                  }
                />
              </div>
            </Card>

            {/* Need help */}
            <Card>
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "अपने दावे में मदद चाहिए?" : "Need help with your claim?"}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {lang === "hi"
                  ? "हमारा सहायक आपको सही कदमों के बारे में मार्गदर्शन कर सकता है।"
                  : "Our assistant can guide you through the right next steps."}
              </p>
              <Button
                variant="brand"
                size="md"
                block
                className="mt-3 gap-2"
                onClick={() => router.push("/claim")}
              >
                <MessageCircle size={16} />
                {lang === "hi" ? "सहायक से चैट करें" : "Chat with Assistant"}
              </Button>
            </Card>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">{t("demoDisclaimer")}</p>
      </PageContainer>
    </AppShell>
  );
}

function StatusLegendRow({ dot, label, desc }: { dot: string; label: string; desc: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot)} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs leading-relaxed text-muted">{desc}</p>
      </div>
    </div>
  );
}
