"use client";

import { useRef, useState } from "react";
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
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderOpen,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  UserCircle,
  Wallet,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Local mock/content data — this page only, not shared elsewhere      */
/* ------------------------------------------------------------------ */

type TicketStatus = "in_progress" | "resolved" | "closed";

interface MockTicket {
  id: string;
  subject: { en: string; hi: string };
  status: TicketStatus;
  lastUpdated: string;
}

const MOCK_TICKETS: MockTicket[] = [
  {
    id: "SR-2026-08-14-00231",
    subject: {
      en: "Claim rejected due to KYC mismatch",
      hi: "KYC मिलान न होने के कारण दावा अस्वीकृत",
    },
    status: "in_progress",
    lastUpdated: "14 Aug 2026, 11:42 AM",
  },
  {
    id: "SR-2026-08-10-00198",
    subject: {
      en: "Unable to upload cancelled cheque",
      hi: "रद्द चेक अपलोड करने में असमर्थ",
    },
    status: "resolved",
    lastUpdated: "10 Aug 2026, 3:15 PM",
  },
  {
    id: "SR-2026-07-29-00076",
    subject: {
      en: "PF transfer not reflecting in passbook",
      hi: "PF स्थानांतरण पासबुक में नहीं दिख रहा",
    },
    status: "closed",
    lastUpdated: "29 Jul 2026, 10:20 AM",
  },
];

const TICKET_STATUS_TONE: Record<TicketStatus, "warning" | "success" | "neutral"> = {
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
};

function ticketStatusLabel(status: TicketStatus, lang: string) {
  if (status === "in_progress") return lang === "hi" ? "प्रगति में" : "In Progress";
  if (status === "resolved") return lang === "hi" ? "हल हो गया" : "Resolved";
  return lang === "hi" ? "बंद" : "Closed";
}

interface HelpTopic {
  key: string;
  icon: any;
  tone: "primary" | "danger" | "success";
  title: { en: string; hi: string };
  desc: { en: string; hi: string };
}

const HELP_TOPICS: HelpTopic[] = [
  {
    key: "claims",
    icon: FileText,
    tone: "primary",
    title: { en: "Claims & Process", hi: "दावे और प्रक्रिया" },
    desc: {
      en: "Claim types, eligibility, timelines and how the process works.",
      hi: "दावा प्रकार, पात्रता, समयसीमा और प्रक्रिया कैसे काम करती है।",
    },
  },
  {
    key: "documents",
    icon: FolderOpen,
    tone: "primary",
    title: { en: "Documents", hi: "दस्तावेज़" },
    desc: {
      en: "Which documents you need and how to upload them correctly.",
      hi: "आपको कौन से दस्तावेज़ चाहिए और उन्हें सही तरीके से कैसे अपलोड करें।",
    },
  },
  {
    key: "kyc",
    icon: UserCircle,
    tone: "primary",
    title: { en: "KYC & Profile", hi: "KYC और प्रोफ़ाइल" },
    desc: {
      en: "Update your KYC details, bank info and personal information.",
      hi: "अपना KYC विवरण, बैंक जानकारी और व्यक्तिगत जानकारी अपडेट करें।",
    },
  },
  {
    key: "payments",
    icon: Wallet,
    tone: "primary",
    title: { en: "Payments & Settlement", hi: "भुगतान और निपटान" },
    desc: {
      en: "How payments are processed and credited to your bank account.",
      hi: "भुगतान कैसे संसाधित होकर आपके बैंक खाते में जमा किए जाते हैं।",
    },
  },
  {
    key: "errors",
    icon: AlertTriangle,
    tone: "danger",
    title: { en: "Errors & Rejections", hi: "त्रुटियां और अस्वीकृतियां" },
    desc: {
      en: "Why claims get rejected and how to fix common errors quickly.",
      hi: "दावे क्यों अस्वीकृत होते हैं और सामान्य त्रुटियों को जल्दी कैसे ठीक करें।",
    },
  },
  {
    key: "security",
    icon: ShieldCheck,
    tone: "success",
    title: { en: "Account & Security", hi: "खाता और सुरक्षा" },
    desc: {
      en: "Privacy, data security and keeping your account safe.",
      hi: "गोपनीयता, डेटा सुरक्षा और अपने खाते को सुरक्षित रखना।",
    },
  },
];

const topicToneClass: Record<HelpTopic["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  danger: "bg-danger-soft text-danger",
  success: "bg-success-soft text-success",
};

interface Faq {
  key: string;
  q: { en: string; hi: string };
  a: { en: string; hi: string };
}

// FAQ content deliberately phrased so the popular-search chips below are
// genuine (guaranteed) substrings of the question text they're meant to surface.
const FAQS: Faq[] = [
  {
    key: "settlement-time",
    q: {
      en: "How long does it take for PF settlement to complete?",
      hi: "PF निपटान पूरा होने में कितना समय लगता है?",
    },
    a: {
      en: "Most claims are settled within 7–20 working days after submission, depending on the claim type and whether all documents are in order.",
      hi: "ज़्यादातर दावे जमा करने के 7–20 कार्य दिवसों के भीतर निपटाए जाते हैं, यह दावे के प्रकार और दस्तावेज़ों की पूर्णता पर निर्भर करता है।",
    },
  },
  {
    key: "check-status",
    q: {
      en: "How do I check my claim status?",
      hi: "मैं अपने दावे की स्थिति कैसे जांचूं?",
    },
    a: {
      en: "Go to My Claims, or open Claim Assistant and select Track Claim Status, to see real-time updates on your submitted claim.",
      hi: "अपने जमा किए गए दावे की वास्तविक समय अपडेट देखने के लिए 'मेरे दावे' पर जाएं, या 'दावा सहायक' खोलकर 'दावा स्थिति ट्रैक करें' चुनें।",
    },
  },
  {
    key: "document-rejection",
    q: {
      en: "What are common reasons for document rejection?",
      hi: "दस्तावेज़ अस्वीकृति के सामान्य कारण क्या हैं?",
    },
    a: {
      en: "Claims are commonly rejected due to name mismatches between Aadhaar and UAN, an unlinked bank account, or missing or blurry documents. Check Verify Your Details to see any issues on your claim.",
      hi: "दावे आमतौर पर आधार और UAN में नाम मिलान न होने, बैंक खाता लिंक न होने, या दस्तावेज़ गायब/धुंधले होने के कारण अस्वीकार किए जाते हैं। किसी भी समस्या को देखने के लिए 'अपना विवरण सत्यापित करें' देखें।",
    },
  },
  {
    key: "documents-required",
    q: {
      en: "What documents are required for full settlement?",
      hi: "पूर्ण निपटान के लिए कौन से दस्तावेज़ आवश्यक हैं?",
    },
    a: {
      en: "Typically Aadhaar, PAN, a cancelled cheque, and Form 15G/H where applicable. Exact requirements depend on your claim type.",
      hi: "आमतौर पर आधार, पैन, एक रद्द चेक, और लागू होने पर फॉर्म 15G/H। सटीक आवश्यकताएं आपके दावे के प्रकार पर निर्भर करती हैं।",
    },
  },
  {
    key: "kyc-update",
    q: {
      en: "How do I complete a KYC update?",
      hi: "मैं अपना KYC अपडेट कैसे पूरा करूं?",
    },
    a: {
      en: "Go to Profile & KYC to update your Aadhaar, PAN, bank or contact details. Some changes may need employer approval on the EPFO portal.",
      hi: "अपना आधार, पैन, बैंक या संपर्क विवरण अपडेट करने के लिए 'प्रोफ़ाइल और KYC' पर जाएं। कुछ बदलावों के लिए EPFO पोर्टल पर नियोक्ता की मंजूरी आवश्यक हो सकती है।",
    },
  },
];

interface Chip {
  key: string;
  label: { en: string; hi: string };
}

const POPULAR_SEARCHES: Chip[] = [
  { key: "status", label: { en: "Claim status", hi: "दावे की स्थिति" } },
  { key: "rejection", label: { en: "Document rejection", hi: "दस्तावेज़ अस्वीकृति" } },
  { key: "time", label: { en: "How long does it take?", hi: "कितना समय लगता है?" } },
  { key: "kyc", label: { en: "KYC update", hi: "KYC अपडेट" } },
];

// Normalize away punctuation so chip labels (which may carry a "?") still
// match as a contiguous substring of the underlying question text.
function normalize(s: string) {
  return s.toLowerCase().replace(/[?.,]/g, "").trim();
}

// Small flat-style illustration — person chatting with support at a laptop.
// Restrained: brand / brand-soft / brand-dark + ink for hair + one neutral skin tone.
function SupportIllustration() {
  return (
    <svg viewBox="0 0 220 200" className="h-full w-full text-line" aria-hidden="true">
      {/* backdrop wash */}
      <circle cx="110" cy="104" r="88" className="fill-brand-soft" />

      {/* desk */}
      <rect x="30" y="150" width="160" height="9" rx="4.5" className="fill-brand/15" />

      {/* laptop */}
      <path d="M62 148 L158 148 L150 130 L70 130 Z" className="fill-surface" stroke="currentColor" strokeWidth="1.5" />
      <rect x="78" y="90" width="64" height="42" rx="4" className="fill-ink" />
      <rect x="82" y="94" width="56" height="34" rx="2" className="fill-brand-dark" />

      {/* torso */}
      <path d="M70 150 C70 116 84 100 110 100 C136 100 150 116 150 150 Z" className="fill-brand" />

      {/* head */}
      <circle cx="110" cy="72" r="24" fill="#F2C29A" />

      {/* hair */}
      <path
        d="M86 68 C84 44 96 30 110 30 C126 30 138 46 134 68 C132 54 122 58 110 58 C98 58 88 56 86 68 Z"
        className="fill-ink"
      />

      {/* speech bubble */}
      <rect x="150" y="34" width="46" height="30" rx="10" className="fill-surface" stroke="currentColor" strokeWidth="1.5" />
      <path d="M158 64 L152 74 L166 64 Z" className="fill-surface" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="163" cy="49" r="3" className="fill-brand" />
      <circle cx="173" cy="49" r="3" className="fill-brand" />
      <circle cx="183" cy="49" r="3" className="fill-brand" />
    </svg>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const toast = useToast();
  const u = MOCK_USER;

  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);

  const norm = normalize(query);
  const filteredFaqs = norm
    ? FAQS.filter((f) => normalize(lang === "hi" ? f.q.hi : f.q.en).includes(norm))
    : FAQS;

  function applySearch() {
    if (!query.trim()) {
      router.push("/claim");
      return;
    }
    faqSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleChipClick(chip: Chip) {
    setQuery(lang === "hi" ? chip.label.hi : chip.label.en);
    requestAnimationFrame(() => {
      faqSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function articlesComingSoon(topic: HelpTopic) {
    toast(
      lang === "hi"
        ? `${topic.title.hi} के लिए लेख जल्द आ रहे हैं। तब तक हमारे सहायक से चैट करें।`
        : `Articles for ${topic.title.en} are coming soon. Chat with our assistant in the meantime.`,
      "info"
    );
  }

  return (
    <AppShell topBar={false}>
      <Header title={lang === "hi" ? "सहायता" : "Support"} />
      <PageContainer className="pt-6">
        {/* Page header — sticky so it stays visible while content scrolls */}
        <div className="sticky top-0 z-20 -mt-6 mb-6 flex flex-wrap items-start justify-between gap-4 bg-canvas/95 pt-6 pb-3 backdrop-blur-md">
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold tracking-tight text-ink sm:text-[24px]">
              {lang === "hi" ? "सहायता" : "Support"}
            </h1>
            <p className="mt-1 text-[15px] text-muted">
              {lang === "hi"
                ? "हर कदम पर हम आपकी मदद के लिए यहां हैं।"
                : "We're here to help you at every step."}
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
            {/* Search card */}
            <Card className="bg-primary-soft/40">
              <div className="flex items-center gap-6">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-ink">
                    {lang === "hi" ? "आज हम आपकी कैसे मदद कर सकते हैं?" : "How can we help you today?"}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {lang === "hi"
                      ? "सहायता लेख खोजें या हमारे सहायक से बात करें।"
                      : "Search for help articles or talk to our assistant."}
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      applySearch();
                    }}
                    className="mt-4 flex flex-col gap-2.5 sm:flex-row"
                  >
                    <div className="relative flex-1">
                      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={lang === "hi" ? "सहायता लेख खोजें..." : "Search for help articles..."}
                        className="w-full rounded-xl border border-line bg-surface py-3 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-primary"
                      />
                    </div>
                    <Button type="submit" variant="brand" size="lg" className="gap-2 sm:w-auto">
                      <Search size={16} />
                      {lang === "hi" ? "खोजें" : "Search"}
                    </Button>
                  </form>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted">
                      {lang === "hi" ? "लोकप्रिय खोजें:" : "Popular searches:"}
                    </span>
                    {POPULAR_SEARCHES.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => handleChipClick(chip)}
                        className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                      >
                        {lang === "hi" ? chip.label.hi : chip.label.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden shrink-0 md:block md:h-36 md:w-36 lg:h-40 lg:w-40">
                  <SupportIllustration />
                </div>
              </div>
            </Card>

            {/* Help topics */}
            <div>
              <h2 className="text-lg font-bold text-ink">
                {lang === "hi" ? "सहायता विषय" : "Help topics"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {lang === "hi"
                  ? "सही मदद पाने के लिए श्रेणी के अनुसार ब्राउज़ करें।"
                  : "Browse by category to find the right help."}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {HELP_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <Card key={topic.key} className="flex flex-col">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          topicToneClass[topic.tone]
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <h3 className="mt-3 text-[15px] font-semibold text-ink">
                        {lang === "hi" ? topic.title.hi : topic.title.en}
                      </h3>
                      <p className="mt-1 flex-1 text-sm text-muted">
                        {lang === "hi" ? topic.desc.hi : topic.desc.en}
                      </p>
                      <button
                        onClick={() => articlesComingSoon(topic)}
                        className="mt-3 inline-flex items-center gap-1 self-start text-sm font-medium text-primary hover:underline"
                      >
                        {lang === "hi" ? "लेख देखें" : "View articles"}
                        <ChevronRight size={14} />
                      </button>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Your requests */}
            <div>
              <h2 className="text-lg font-bold text-ink">
                {lang === "hi" ? "आपके अनुरोध" : "Your Requests"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {lang === "hi"
                  ? "अपने सहायता अनुरोधों की स्थिति ट्रैक करें।"
                  : "Track the status of your support requests."}
              </p>
              <Card className="mt-4 divide-y divide-line p-0">
                {MOCK_TICKETS.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => router.push("/claim/tracker")}
                    className="flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors hover:bg-canvas sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0 sm:w-40 sm:shrink-0">
                      <p className="text-xs text-muted">{lang === "hi" ? "अनुरोध ID" : "Request ID"}</p>
                      <p className="text-sm font-semibold text-ink">{ticket.id}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted sm:hidden">{lang === "hi" ? "विषय" : "Subject"}</p>
                      <p className="truncate text-[15px] text-ink">
                        {lang === "hi" ? ticket.subject.hi : ticket.subject.en}
                      </p>
                    </div>
                    <div className="sm:w-32 sm:shrink-0">
                      <Badge tone={TICKET_STATUS_TONE[ticket.status]}>
                        {ticketStatusLabel(ticket.status, lang)}
                      </Badge>
                    </div>
                    <div className="sm:w-40 sm:shrink-0">
                      <p className="text-xs text-muted sm:hidden">{lang === "hi" ? "अंतिम अपडेट" : "Last Updated"}</p>
                      <p className="text-sm text-muted">{ticket.lastUpdated}</p>
                    </div>
                    <ChevronRight size={16} className="hidden shrink-0 text-muted sm:block" />
                  </button>
                ))}
              </Card>
            </div>

            {/* FAQ */}
            <div ref={faqSectionRef} className="scroll-mt-6">
              <h2 className="text-lg font-bold text-ink">
                {lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently asked questions"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {lang === "hi" ? "सामान्य प्रश्नों के त्वरित उत्तर।" : "Quick answers to common questions."}
              </p>

              {filteredFaqs.length > 0 ? (
                <Card className="mt-4 divide-y divide-line p-0">
                  {filteredFaqs.map((faq) => {
                    const open = openFaq === faq.key;
                    return (
                      <div key={faq.key}>
                        <button
                          onClick={() => setOpenFaq(open ? null : faq.key)}
                          aria-expanded={open}
                          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-canvas"
                        >
                          <span className="flex-1 text-[15px] font-medium text-ink">
                            {lang === "hi" ? faq.q.hi : faq.q.en}
                          </span>
                          <ChevronDown
                            size={16}
                            className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")}
                          />
                        </button>
                        {open && (
                          <div className="animate-fade-in px-4 pb-4">
                            <p className="text-sm leading-relaxed text-muted">
                              {lang === "hi" ? faq.a.hi : faq.a.en}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Card>
              ) : (
                <Card className="mt-4 py-8 text-center">
                  <p className="text-sm text-muted">
                    {lang === "hi"
                      ? "कोई मिलान परिणाम नहीं मिला। कृपया कोई और शब्द आज़माएं।"
                      : "No matching results found. Try a different search term."}
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Right sidebar — sticky so it doesn't force blank scroll space */}
          <div className="hidden space-y-5 lg:sticky lg:top-24 lg:block lg:self-start">
            {/* Contact Support */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "सहायता से संपर्क करें" : "Contact Support"}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => router.push("/claim")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-canvas"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <MessageCircle size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {lang === "hi" ? "सहायक से चैट करें" : "Chat with Assistant"}
                    </p>
                    <p className="text-xs text-muted">
                      {lang === "hi" ? "अपने दावे में मदद पाएं" : "Get help with your claim"}
                    </p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-muted/50" />
                </button>

                <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {lang === "hi" ? "कॉल करें" : "Call Us"}
                    </p>
                    <p className="text-xs text-muted">1800 123 1188</p>
                    <p className="text-xs text-muted">
                      {lang === "hi" ? "सोम–शनि, सुबह 9 – शाम 6 बजे" : "Mon–Sat, 9 AM – 6 PM"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Before you contact us */}
            <Card>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {lang === "hi" ? "संपर्क करने से पहले" : "Before you contact us"}
              </h3>
              <p className="mb-3 text-sm text-muted">
                {lang === "hi"
                  ? "तेज़ी से मदद के लिए यह जानकारी तैयार रखें।"
                  : "Keep the following ready so we can help you faster."}
              </p>
              <ul className="space-y-2.5">
                {[
                  { en: "UAN Number", hi: "UAN नंबर" },
                  { en: "Registered Mobile Number", hi: "पंजीकृत मोबाइल नंबर" },
                  { en: "Claim ID (if applicable)", hi: "क्लेम ID (यदि लागू हो)" },
                ].map((item) => (
                  <li key={item.en} className="flex items-start gap-2.5 text-sm text-ink">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                    {lang === "hi" ? item.hi : item.en}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">{t("demoDisclaimer")}</p>
      </PageContainer>
    </AppShell>
  );
}
