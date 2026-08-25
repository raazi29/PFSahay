"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { DemoControls } from "@/components/DemoControls";
import { useLanguage } from "@/context/LanguageContext";
import {
  Lock,
  MessageSquare,
  ShieldCheck,
  FileText,
  BarChart3,
  Building2,
  FlaskConical,
  Users,
  ArrowRight,
  Check,
  Sparkles,
  Menu,
  X,
  IndianRupee,
  Search,
  Send,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const [mobileNav, setMobileNav] = useState(false);

  const login = () => router.push("/login");

  return (
    <div className="min-h-screen bg-canvas">
      {/* ─────────────────────────  Top nav  ───────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-[15px] font-bold tracking-tight text-white shadow-soft">
              P
            </div>
            <span className="text-[15px] font-bold tracking-tight text-ink">PFSahay</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
            <a href="#how" className="transition-colors hover:text-ink">
              {hi ? "कैसे काम करता है" : "How it works"}
            </a>
            <a href="#why" className="transition-colors hover:text-ink">
              {hi ? "क्यों PFSahay" : "Why PFSahay"}
            </a>
            <a href="#support" className="transition-colors hover:text-ink">
              {hi ? "सहायता" : "Support"}
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageToggle />
            <Button size="md" onClick={login} className="gap-2">
              <Lock size={15} />
              {hi ? "UAN से लॉगिन" : "Login with UAN"}
            </Button>
          </div>

          {/* Mobile: toggle + menu */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <button
              onClick={() => setMobileNav((v) => !v)}
              aria-label={mobileNav ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-soft"
            >
              {mobileNav ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileNav && (
          <div className="border-t border-line bg-surface px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-muted">
              <a href="#how" onClick={() => setMobileNav(false)} className="py-1 hover:text-ink">
                {hi ? "कैसे काम करता है" : "How it works"}
              </a>
              <a href="#why" onClick={() => setMobileNav(false)} className="py-1 hover:text-ink">
                {hi ? "क्यों PFSahay" : "Why PFSahay"}
              </a>
              <a href="#support" onClick={() => setMobileNav(false)} className="py-1 hover:text-ink">
                {hi ? "सहायता" : "Support"}
              </a>
            </nav>
            <Button block onClick={login} className="mt-4 gap-2">
              <Lock size={15} />
              {hi ? "UAN से लॉगिन" : "Login with UAN"}
            </Button>
          </div>
        )}
      </header>

      {/* ─────────────────────────  Hero  ───────────────────────── */}
      <section className="relative overflow-hidden bg-canvas">
        {/* soft brand wash top, navy blob bottom-right */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-15%,rgba(45,139,110,0.07),transparent)]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[460px] w-[460px] rounded-full bg-primary/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left — copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-3.5 py-1.5">
                <Sparkles size={13} className="text-brand" />
                <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {hi ? "AI-संचालित PF दावा सहायक" : "AI-Powered PF Claim Assistant"}
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-[3.5rem]">
                {hi ? (
                  <>
                    आपका PF।
                    <br />
                    आपका पैसा।
                    <br />
                    हम <WavyWord>सरल</WavyWord> बनाते हैं।
                  </>
                ) : (
                  <>
                    Your PF.
                    <br />
                    Your Money.
                    <br />
                    We <WavyWord>Simplify</WavyWord>.
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted">
                {hi
                  ? "PFSahay आपको EPF दावा प्रक्रिया में मार्गदर्शन देता है, जमा करने से पहले गलतियाँ पकड़ता है, और आपको आत्मविश्वास से पैसा पाने में मदद करता है।"
                  : "PFSahay guides you through the EPF claim process, catches mistakes before submission, and helps you get your money with confidence."}
              </p>
              <p className="mt-2 text-[15px] text-muted/70">
                {hi
                  ? "कोई शब्दावली नहीं। कोई भ्रम नहीं। बस एक सरल बातचीत।"
                  : "No jargon. No confusion. Just a simple conversation."}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={login} className="gap-2">
                  <Lock size={16} />
                  {hi ? "UAN से लॉगिन" : "Login with UAN"}
                </Button>
                <span className="text-sm font-medium text-muted">
                  {hi ? "तेज़, सुरक्षित और आसान" : "Quick, secure and easy"}
                </span>
              </div>

              {/* Trust badges */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                <TrustBadge label={hi ? "100% सुरक्षित" : "100% Secure"} />
                <TrustBadge label={hi ? "निजी" : "Private"} />
                <TrustBadge label={hi ? "EPFO सदस्यों के लिए" : "Built for EPFO Members"} />
              </div>
            </div>

            {/* Right — phone mockup / dashboard preview */}
            <div className="relative hidden justify-center pb-6 md:flex">
              <div className="relative w-[290px]">
                <div className="overflow-hidden rounded-[2.5rem] border-[3px] border-ink/8 bg-white shadow-[0_28px_80px_-24px_rgba(27,46,75,0.28),0_0_0_1px_rgba(0,0,0,0.02)]">
                  {/* status notch */}
                  <div className="flex justify-center bg-primary pt-3">
                    <div className="h-1.5 w-24 rounded-full bg-white/25" />
                  </div>
                  {/* navy header */}
                  <div className="bg-primary px-5 pb-6 pt-4">
                    <p className="text-sm text-white/60">{hi ? "नमस्ते," : "Good morning,"}</p>
                    <p className="mt-0.5 text-xl font-bold text-white">{hi ? "अर्जुन" : "Arjun"}</p>
                    <div className="mt-4 rounded-2xl bg-white/10 p-3.5">
                      <p className="text-xs text-white/60">{hi ? "आपका PF बैलेंस" : "Your PF Balance"}</p>
                      <p className="mt-1 flex items-center text-2xl font-bold text-white">
                        <IndianRupee size={18} className="mr-0.5" />
                        2,84,650
                      </p>
                    </div>
                  </div>
                  {/* body */}
                  <div className="space-y-2.5 px-4 py-4">
                    <div className="flex items-center gap-3 rounded-xl bg-canvas p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted">
                          {hi ? "नियोक्ता" : "Employer"}
                        </p>
                        <p className="text-xs font-semibold text-ink">Acme Technologies</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-brand/15 bg-brand/8 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15">
                        <FileText size={14} className="text-brand-dark" />
                      </div>
                      <p className="text-xs font-semibold text-brand-dark">
                        {hi ? "PF दावा / निकासी" : "Claim / Withdraw PF"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-canvas p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/10">
                        <BarChart3 size={14} className="text-muted" />
                      </div>
                      <p className="text-xs font-semibold text-ink">
                        {hi ? "दावा स्थिति जांचें" : "Check Claim Status"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* floating card — AI guidance */}
                <div className="absolute -right-8 top-6 rounded-xl border border-line bg-white px-3 py-2.5 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-success/12">
                      <Check size={12} className="text-success" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-ink">{hi ? "AI मार्गदर्शन" : "AI Guidance"}</p>
                      <p className="text-[9px] text-muted">{hi ? "समझता है आपको" : "Understands your needs"}</p>
                    </div>
                  </div>
                </div>

                {/* floating card — track progress */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-line bg-white px-3 py-2.5 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/12">
                      <Clock size={12} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-ink">{hi ? "प्रगति ट्रैक" : "Track Progress"}</p>
                      <p className="text-[9px] text-muted">{hi ? "अगला क्या है" : "See what's next"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Trust banner  ───────────────────────── */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <p className="text-base font-bold">
                  {hi ? "सुरक्षित। निजी। भरोसेमंद।" : "Secure. Private. Trusted."}
                </p>
                <p className="text-sm text-white/60">
                  {hi
                    ? "PFSahay EPFO सदस्यों के लिए बनाया गया एक डेमो प्लेटफॉर्म है।"
                    : "PFSahay is a demo platform built for EPFO members."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:flex lg:items-center lg:gap-6">
              <TrustItem icon={Building2} label={hi ? "कोई वास्तविक EPFO एकीकरण नहीं" : "No real EPFO integration"} />
              <TrustItem icon={FlaskConical} label={hi ? "100% मॉक वातावरण" : "100% Mock Environment"} />
              <TrustItem icon={Lock} label={hi ? "गोपनीयता पहले" : "Privacy First"} />
              <TrustItem icon={Users} label={hi ? "EPFO सदस्यों के लिए" : "Made for EPFO Members"} />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────  How it works  ───────────────────────── */}
      <section id="how" className="bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
              {hi ? "3 सरल चरण" : "3 Simple Steps"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              {hi ? "3 सरल चरणों में अपना PF क्लेम करें" : "Claim your PF in 3 simple steps"}
            </h2>
            <p className="mt-2 text-muted">
              {hi ? "बताएं → हम जाँचें → आप सबमिट करें" : "Tell us → We check → You submit"}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              step={1}
              icon={MessageSquare}
              title={hi ? "बताएं आपको क्या चाहिए" : "Tell us what you need"}
              desc={
                hi
                  ? "सरल शब्दों में अपनी स्थिति बताएं। हमारा AI सही दावा प्रकार चुनता है।"
                  : "Explain your situation in plain words. Our AI picks the right claim type."
              }
            />
            <StepCard
              step={2}
              icon={Search}
              title={hi ? "हम सब कुछ जाँचते हैं" : "We check everything"}
              desc={
                hi
                  ? "हम EPFO नियमों के अनुसार आपके विवरण की जाँच करते हैं और समस्याएँ पहले पकड़ते हैं।"
                  : "We validate your details against EPFO rules and flag issues early."
              }
            />
            <StepCard
              step={3}
              icon={Send}
              title={hi ? "सबमिट करें और ट्रैक करें" : "Submit and track"}
              desc={
                hi
                  ? "समीक्षा करें, सबमिट करें, और स्पष्ट अपडेट के साथ अपने दावे को ट्रैक करें।"
                  : "Review, submit, and follow your claim with clear status updates."
              }
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Why PFSahay (features)  ───────────────────────── */}
      <section id="why" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles size={12} /> {hi ? "विशेषताएँ" : "Features"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              {hi ? "क्यों PFSahay?" : "Why PFSahay?"}
            </h2>
            <p className="mt-2 text-lg text-muted">
              {hi ? "जो चाहिए वो सब। जो नहीं चाहिए वो नहीं।" : "Everything you need. Nothing you don't."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={MessageSquare}
              tone="green"
              title={hi ? "बोलें, टाइप न करें" : "Talk, Don't Type"}
              desc={
                hi
                  ? "बस अपने शब्दों में बताएं आपको क्या चाहिए — कोई फॉर्म नहीं, कोई शब्दावली नहीं।"
                  : "Just say what you need in your own words — no forms, no jargon."
              }
            />
            <FeatureCard
              icon={ShieldCheck}
              tone="purple"
              title={hi ? "स्मार्ट दावा जाँच" : "Smarter Claim Checks"}
              desc={
                hi
                  ? "हम आपके विवरण की समीक्षा करते हैं और सबमिट करने से पहले गलतियाँ पकड़ते हैं।"
                  : "We review your details and catch mistakes before you submit."
              }
            />
            <FeatureCard
              icon={FileText}
              tone="blue"
              title={hi ? "मार्गदर्शित, भ्रमित नहीं" : "Guided, Not Confusing"}
              desc={
                hi
                  ? "सरल चरण-दर-चरण मार्गदर्शन ताकि आपको हमेशा पता हो आगे क्या है।"
                  : "Simple step-by-step guidance so you always know what's next."
              }
            />
            <FeatureCard
              icon={BarChart3}
              tone="orange"
              title={hi ? "स्पष्टता से ट्रैक करें" : "Track with Clarity"}
              desc={
                hi
                  ? "हर चरण पर सरल भाषा में अपडेट के साथ अपने दावे को ट्रैक करें।"
                  : "Follow your claim with plain-language updates at every step."
              }
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Bottom CTA  ───────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center shadow-card md:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/[0.06] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-brand/12 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <IndianRupee size={26} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-[2rem]">
                {hi ? "अपना PF क्लेम करने के लिए तैयार?" : "Ready to claim your PF?"}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-white/70">
                {hi
                  ? "अपने UAN से लॉगिन करें और PFSahay को मार्गदर्शन करने दें — तेज़, सुरक्षित और तनाव-मुक्त।"
                  : "Log in with your UAN and let PFSahay guide you — quick, secure, and stress-free."}
              </p>
              <div className="mt-7 flex justify-center">
                <Button
                  size="lg"
                  onClick={login}
                  className="gap-2 bg-white text-primary hover:bg-white/90 active:bg-white/90"
                >
                  <Lock size={16} />
                  {hi ? "UAN से लॉगिन" : "Login with UAN"}
                  <ArrowRight size={16} />
                </Button>
              </div>
              <p className="mt-4 text-xs text-white/55">
                {hi
                  ? "2 मिनट से कम · जरूरत होने तक कोई दस्तावेज़ नहीं"
                  : "Under 2 minutes · No documents until you need them"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Footer  ───────────────────────── */}
      <footer id="support" className="border-t border-line bg-surface py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
              P
            </div>
            <span className="font-semibold text-ink">PFSahay</span>
            <span className="text-muted/40">·</span>
            <span>{hi ? "आपका PF, सरल।" : "Your PF, Simplified."}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              {hi
                ? "डेमो वातावरण — अनुकरणित डेटा। EPFO से संबद्ध नहीं।"
                : "Demo environment — simulated data. Not affiliated with EPFO."}
            </span>
          </div>
        </div>
      </footer>

      {/* Demo controls still available on landing for QA */}
      <DemoControls />
    </div>
  );
}

/* ────────────────────────────  Helpers  ──────────────────────────── */

// 'Simplify' with a hand-drawn teal-green wavy underline.
function WavyWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-brand">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="absolute -bottom-1 left-0 h-2.5 w-full text-brand"
      >
        <path
          d="M2 7 Q 25 1 50 7 T 100 7 T 150 7 T 198 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// Small green-check trust pill used in the hero.
function TrustBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/12">
        <Check size={10} className="text-success" />
      </span>
      {label}
    </span>
  );
}

// Item in the dark trust banner.
function TrustItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/75">
      <Icon size={15} className="shrink-0 text-white/50" />
      <span>{label}</span>
    </div>
  );
}

// Feature card with a distinctly colored icon tile.
const FEATURE_TONES: Record<string, string> = {
  green: "bg-success/10 text-success",
  purple: "bg-violet-100 text-violet-600",
  blue: "bg-blue-100 text-blue-600",
  orange: "bg-accent/10 text-accent",
};

function FeatureCard({
  icon: Icon,
  tone,
  title,
  desc,
}: {
  icon: any;
  tone: keyof typeof FEATURE_TONES;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-2xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_32px_-14px_rgba(27,46,75,0.18)]">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${FEATURE_TONES[tone]}`}>
        <Icon size={22} />
      </div>
      <h3 className="text-[15px] font-bold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

// Numbered step in the 'How it works' section.
function StepCard({
  step,
  icon: Icon,
  title,
  desc,
}: {
  step: number;
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        {step}
      </div>
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Icon size={16} className="text-brand" />
          <h3 className="text-[15px] font-bold text-ink">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted">{desc}</p>
      </div>
    </div>
  );
}
