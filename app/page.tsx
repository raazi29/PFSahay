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
  ArrowRight,
  Check,
  Sparkles,
  Menu,
  X,
  Search,
  Send,
  CheckCircle2,
  Clock,
  Copy,
  Play,
  Star,
  Users,
  Fingerprint,
  CreditCard,
  PenTool,
  Eye,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const [mobileNav, setMobileNav] = useState(false);

  const startClaim = () => router.push("/login");

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-3.5 lg:px-10">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold">
              P
            </div>
            <div>
              <span className="text-[15px] font-bold tracking-tight text-ink">PFSahay</span>
              <span className="ml-1.5 text-xs text-muted hidden sm:inline">Your PF. Simplified.</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-[14px] font-medium text-muted lg:flex">
            <a href="#how" className="transition-colors hover:text-ink">
              {hi ? "कैसे काम करता है" : "How it works"}
            </a>
            <a href="#features" className="transition-colors hover:text-ink">
              {hi ? "विशेषताएँ" : "Features"}
            </a>
            <a href="#about" className="transition-colors hover:text-ink">
              {hi ? "बारे में" : "About"}
            </a>
            <a href="#help" className="transition-colors hover:text-ink">
              {hi ? "सहायता" : "Help"}
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <Button size="md" onClick={startClaim} className="gap-2">
              {hi ? "दावा शुरू करें" : "Start a claim"}
              <ArrowRight size={15} />
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle />
            <button
              onClick={() => setMobileNav((v) => !v)}
              aria-label={mobileNav ? "Close" : "Menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink"
            >
              {mobileNav ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileNav && (
          <div className="border-t border-line bg-white px-6 py-4 lg:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-muted">
              <a href="#how" onClick={() => setMobileNav(false)} className="py-1 hover:text-ink">How it works</a>
              <a href="#features" onClick={() => setMobileNav(false)} className="py-1 hover:text-ink">Features</a>
              <a href="#help" onClick={() => setMobileNav(false)} className="py-1 hover:text-ink">Help</a>
            </nav>
            <Button block onClick={startClaim} className="mt-4 gap-2">
              {hi ? "दावा शुरू करें" : "Start a claim"} <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </header>

      {/* ─── Hero Section ─── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            {/* Left — Copy */}
            <div className="pt-4">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
                {hi ? "EPFO सदस्यों के लिए बनाया गया" : "BUILT FOR EPFO MEMBERS"}
              </p>

              <h1 className="text-[2.75rem] font-bold leading-[1.1] tracking-tight text-ink lg:text-[3.5rem]">
                {hi ? (
                  <>आपका PF।<br />बिना <em className="font-serif italic text-primary not-italic">भ्रम</em> के।</>
                ) : (
                  <>Your PF.<br />Without the <em className="font-serif italic text-primary not-italic">confusion</em>.</>
                )}
              </h1>

              <div className="mt-4 h-1 w-10 rounded-full bg-primary" />

              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted">
                {hi
                  ? "बताएं आपको क्या चाहिए। PFSahay सही दावा पता करता है, आपके विवरण जाँचता है, और आपके साथ तैयार करता है।"
                  : "Tell us what you need. PFSahay figures out the right claim, checks your details, and prepares it with you."}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={startClaim} className="gap-2">
                  {hi ? "दावा शुरू करें" : "Start a claim"}
                  <ArrowRight size={16} />
                </Button>
                <a href="#how" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
                    <Play size={12} className="ml-0.5" />
                  </span>
                  {hi ? "देखें कैसे" : "See how it works"}
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["A", "R", "S", "P"].map((letter, i) => (
                    <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary/10 text-xs font-bold text-primary">
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-xs text-muted">{hi ? "हज़ारों EPFO सदस्यों द्वारा भरोसा" : "Trusted by thousands of EPFO members"}</p>
                </div>
              </div>
            </div>

            {/* Right — App Preview Widget */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
                {/* Widget header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <MessageSquare size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">PFSahay Assistant</p>
                  </div>
                </div>

                <div className="grid grid-cols-[180px_1fr_200px] gap-4">
                  {/* Left - Steps */}
                  <div className="space-y-3 border-r border-line pr-4">
                    {[
                      { icon: MessageSquare, label: hi ? "कारण" : "Reason", active: true },
                      { icon: Search, label: hi ? "सत्यापन" : "Verification", active: false },
                      { icon: FileText, label: hi ? "दस्तावेज़" : "Documents", active: false },
                      { icon: Eye, label: hi ? "समीक्षा" : "Review", active: false },
                      { icon: BarChart3, label: hi ? "ट्रैकर" : "Tracker", active: false },
                    ].map((step, i) => (
                      <div key={i} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${step.active ? "bg-primary/8 text-primary font-medium" : "text-muted"}`}>
                        <step.icon size={15} />
                        {step.label}
                      </div>
                    ))}
                  </div>

                  {/* Center - Chat preview */}
                  <div className="px-2">
                    <p className="text-sm text-muted mb-4">
                      {hi ? "शुरू करते हैं।" : "Let's start with one thing."}
                    </p>
                    <p className="text-[15px] font-semibold text-ink mb-5">
                      {hi ? "आपको अपना PF क्यों चाहिए?" : "Why do you need your PF?"}
                    </p>
                    <div className="space-y-2.5">
                      {[
                        { icon: "💼", label: hi ? "मैंने नौकरी बदली है" : "I changed jobs", selected: true },
                        { icon: "👤", label: hi ? "मैं बेरोज़गार हूँ" : "I'm currently unemployed", selected: false },
                        { icon: "•••", label: hi ? "कोई और कारण" : "Something else", selected: false },
                      ].map((opt, i) => (
                        <button
                          key={i}
                          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-colors ${
                            opt.selected ? "border-primary bg-primary/5 font-medium text-ink" : "border-line hover:border-muted text-ink"
                          }`}
                        >
                          <span className="text-base">{opt.icon}</span>
                          <span className="flex-1">{opt.label}</span>
                          <ArrowRight size={14} className="text-muted" />
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                      <Lock size={11} />
                      {hi ? "आपकी जानकारी निजी और सुरक्षित है" : "Your information is private and secure"}
                    </p>
                  </div>

                  {/* Right - Estimated claim */}
                  <div className="border-l border-line pl-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1">
                      {hi ? "अनुमानित दावा" : "ESTIMATED CLAIM"}
                    </p>
                    <p className="text-2xl font-bold text-ink">₹2,84,650</p>
                    <p className="text-sm font-medium text-primary">
                      {hi ? "पूर्ण PF सेटलमेंट" : "Full PF Settlement"}
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <Clock size={13} className="text-muted mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-ink">{hi ? "समय" : "Timeline"}</p>
                          <p className="text-xs text-muted">15 – 20 days*</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText size={13} className="text-muted mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-ink">{hi ? "दस्तावेज़" : "Documents"}</p>
                          <p className="text-xs text-muted">{hi ? "3 आवश्यक" : "3 required"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-muted mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-ink">{hi ? "सत्यापन" : "Verification"}</p>
                          <p className="text-xs text-muted">{hi ? "स्वतः जाँच" : "Auto-checked"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-canvas p-3">
                      <p className="text-[11px] font-bold text-primary">{hi ? "डेमो वातावरण" : "Demo environment"}</p>
                      <p className="text-[11px] text-muted">{hi ? "कोई वास्तविक EPFO खाता कनेक्ट नहीं" : "No real EPFO account connected"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problem → Solution → Outcome ─── */}
      <section className="border-y border-line bg-canvas">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* THE PROBLEM */}
            <div className="relative">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                {hi ? "समस्या" : "THE PROBLEM"}
              </p>
              <h3 className="text-2xl font-bold leading-snug text-ink lg:text-[1.75rem]">
                {hi ? "प्रक्रिया कठिन है। नियम भ्रमित करने वाले हैं।" : "The process is difficult. The rules are confusing."}
              </h3>
              <div className="mt-3 h-1 w-8 rounded-full bg-primary" />
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {hi
                  ? "फॉर्म जटिल हैं। आवश्यकताएं बदलती हैं। एक छोटी गलती बड़ी देरी का कारण बन सकती है।"
                  : "Forms are complex. Requirements change. A small mistake can cause big delays."}
              </p>
            </div>

            {/* OUR SOLUTION */}
            <div className="relative flex flex-col items-center text-center lg:border-x lg:border-line lg:px-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                {hi ? "हमारा समाधान" : "OUR SOLUTION"}
              </p>
              <h3 className="text-2xl font-bold leading-snug text-ink lg:text-[1.75rem]">
                {hi ? "हम जाँचते हैं कि क्या गलत हो सकता है।" : "We check what could go wrong."}
              </h3>
              {/* Mismatch demo */}
              <div className="mt-6 flex items-center gap-3">
                <div className="rounded-xl border border-line bg-white px-4 py-3 text-center">
                  <p className="text-[10px] uppercase text-muted">AADHAAR</p>
                  <p className="text-sm font-bold text-ink">Arjun Mehta</p>
                </div>
                <span className="text-xl font-bold text-danger">≠</span>
                <div className="rounded-xl border border-line bg-white px-4 py-3 text-center">
                  <p className="text-[10px] uppercase text-muted">UAN</p>
                  <p className="text-sm font-bold text-ink">Arjun M.</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">
                {hi
                  ? "छोटा अंतर बड़ी देरी बन सकता है।"
                  : "A small difference can become a big delay."}
              </p>
              <a href="/login" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                {hi ? "फ़ाइल करने से पहले ठीक करें" : "Fix it before you file"} <ArrowRight size={13} />
              </a>
            </div>

            {/* THE OUTCOME */}
            <div className="relative lg:pl-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                {hi ? "परिणाम" : "THE OUTCOME"}
              </p>
              <h3 className="text-2xl font-bold leading-snug text-ink lg:text-[1.75rem]">
                {hi
                  ? "एक सही, पूर्ण और तेज़ दावा।"
                  : "A claim that's correct, complete and ready for faster processing."}
              </h3>
              <div className="mt-6 flex items-center justify-center lg:justify-start">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how" className="bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-20">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            {hi ? "कैसे काम करता है" : "HOW IT WORKS"}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            {hi ? "बातचीत से दावा तक।" : "From conversation to claim."}
          </h2>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
            {[
              { icon: MessageSquare, title: hi ? "आप बताएं" : "You tell us", desc: hi ? "अपने शब्दों में" : "In your own words" },
              { icon: Sparkles, title: hi ? "हम समझें" : "We understand", desc: hi ? "AI सही दावा चुनता है" : "AI picks the right claim" },
              { icon: Search, title: hi ? "हम जाँचें" : "We verify", desc: hi ? "विवरण जाँच, समस्याएँ पकड़ें" : "Check details, catch issues" },
              { icon: PenTool, title: hi ? "हम ठीक करें" : "We fix", desc: hi ? "मार्गदर्शन के साथ सुधार" : "Correct mismatches" },
              { icon: FileText, title: hi ? "हम तैयार करें" : "We prepare", desc: hi ? "दावा तैयार" : "Generate claim" },
              { icon: Send, title: hi ? "आप सबमिट करें" : "You submit", desc: hi ? "आपकी ओर से EPFO को" : "Send to EPFO" },
              { icon: BarChart3, title: hi ? "आप ट्रैक करें" : "You track", desc: hi ? "हर चरण की जानकारी" : "Status at every step" },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary mb-3">
                  <step.icon size={20} />
                </div>
                <p className="text-sm font-bold text-ink">{step.title}</p>
                <p className="mt-0.5 text-xs text-muted leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tracker Preview ─── */}
      <section className="border-t border-line bg-canvas" id="features">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                {hi ? "वास्तविक समय ट्रैकिंग" : "REAL-TIME TRACKING"}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                {hi ? "हर चरण ट्रैक करें। हमेशा जानें आगे क्या है।" : "Track every step. Know what's next."}
              </h2>
              <p className="mt-4 text-[15px] text-muted leading-relaxed max-w-md">
                {hi
                  ? "कोई अनुमान नहीं। कोई भ्रम नहीं। बस स्पष्ट स्थिति अपडेट।"
                  : "No guessing. No confusion. Just clear status updates."}
              </p>
            </div>

            {/* Tracker widget */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <p className="text-sm font-bold text-ink mb-1">
                {hi ? "आपका दावा ट्रैकर" : "Your Claim Tracker"}
              </p>
              <div className="flex items-center gap-2 mb-6">
                <p className="text-lg font-mono font-bold text-ink">PF-2026-482931</p>
                <button className="text-muted hover:text-ink">
                  <Copy size={14} />
                </button>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between">
                {[
                  { label: hi ? "सबमिट" : "Submitted", done: true, date: "24 May, 11:42 AM" },
                  { label: hi ? "सत्यापन" : "Under Verification", done: true, date: "24 May, 2:15 PM" },
                  { label: hi ? "अनुमोदन" : "Approval", done: false, date: hi ? "प्रगति में" : "In progress" },
                  { label: hi ? "भुगतान" : "Disbursal", done: false, date: hi ? "लंबित" : "Pending" },
                ].map((stage, i, arr) => (
                  <div key={i} className="flex flex-1 flex-col items-center text-center relative">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stage.done ? "bg-primary text-white" : "border-2 border-line bg-white text-muted"}`}>
                      {stage.done ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-muted/30" />}
                    </div>
                    <p className="mt-2 text-xs font-medium text-ink">{stage.label}</p>
                    <p className="text-[10px] text-muted">{stage.date}</p>
                    {i < arr.length - 1 && (
                      <div className={`absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-0.5 ${i < arr.findIndex(s => !s.done) ? "bg-primary" : "bg-line"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-white" id="help">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10">
          <div className="rounded-2xl bg-primary px-8 py-12 text-center lg:px-16">
            <h2 className="text-2xl font-bold text-white lg:text-3xl">
              {hi ? "अपना PF क्लेम करने के लिए तैयार?" : "Ready to claim your PF?"}
            </h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto">
              {hi
                ? "कोई शब्दावली नहीं। कोई भ्रम नहीं। बस एक सरल बातचीत।"
                : "No jargon. No confusion. Just a simple conversation and we'll handle the rest."}
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={startClaim}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-primary shadow-lg hover:bg-canvas transition-colors"
              >
                <Lock size={16} />
                {hi ? "UAN से लॉगिन करें" : "Login with UAN"}
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="mt-3 text-xs text-white/50">
              {hi ? "2 मिनट से कम · डेमो वातावरण" : "Under 2 minutes · Demo environment"}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer id="about" className="border-t border-line bg-white py-8">
        <div className="mx-auto max-w-[1320px] flex flex-col items-center justify-between gap-4 px-6 text-sm text-muted lg:flex-row lg:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">P</div>
            <span className="font-semibold text-ink">PFSahay</span>
            <span className="text-muted/40">·</span>
            <span>{hi ? "आपका PF, सरल।" : "Your PF, Simplified."}</span>
          </div>
          <p>{hi ? "डेमो वातावरण — अनुकरणित डेटा। EPFO से संबद्ध नहीं।" : "Demo environment — simulated data. Not affiliated with EPFO."}</p>
        </div>
      </footer>

      <DemoControls />
    </div>
  );
}
