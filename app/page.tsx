"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { DemoControls } from "@/components/DemoControls";
import { useLanguage } from "@/context/LanguageContext";
import {
  Lock,
  ArrowRight,
  Check,
  Menu,
  X,
  Copy,
  Play,
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
        <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
              {hi ? "EPFO सदस्यों के लिए बनाया गया" : "BUILT FOR EPFO MEMBERS"}
            </p>

            <h1 className="text-[2.75rem] font-bold leading-[1.1] tracking-tight text-ink lg:text-[3.75rem]">
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

            <p className="mt-10 flex items-center gap-1.5 text-xs text-muted">
              <Lock size={12} />
              {hi ? "डेमो वातावरण — कोई वास्तविक EPFO खाता कनेक्ट नहीं" : "Demo environment — no real EPFO account connected"}
            </p>
          </div>

          {/* Right — a real screenshot of the product's signature moment, not a mockup */}
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-elevated">
              <div className="flex items-center gap-1.5 border-b border-line bg-canvas px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="ml-2 text-[11px] text-muted">pfsahay.app/claim/verify</span>
              </div>
              <img
                src="/shots/verify.png"
                alt={hi ? "PFSahay असली उत्पाद — नाम मिलान की जाँच" : "PFSahay's real product — catching a name mismatch before you file"}
                className="block w-full"
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              {hi ? "यह असली PFSahay ऐप है — कोई मॉकअप नहीं।" : "This is the real PFSahay app — not a mockup."}
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* ─── The signature moment: one editorial statement, one real proof point ─── */}
      <section className="border-y border-line bg-canvas">
        <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-ink lg:text-[2.25rem]">
              {hi ? (
                <>ज़्यादातर दावे <em className="font-serif italic text-primary not-italic">नियमों</em> की वजह से नहीं, <em className="font-serif italic text-primary not-italic">छोटी गलतियों</em> की वजह से अटकते हैं जो समय पर कोई नहीं पकड़ता।</>
              ) : (
                <>Most claims don't stall on the <em className="font-serif italic text-primary not-italic">rules</em>. They stall on <em className="font-serif italic text-primary not-italic">small mismatches</em> nobody catches in time.</>
              )}
            </h2>
          </div>

          {/* The mismatch demo — the actual proof, given room to breathe */}
          <div className="mx-auto mt-14 max-w-xl">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="flex-1 rounded-2xl border border-line bg-white px-5 py-5 text-center shadow-card">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Aadhaar</p>
                <p className="mt-1 text-lg font-bold text-ink">Arjun Mehta</p>
              </div>
              <span className="shrink-0 text-2xl font-bold text-danger">≠</span>
              <div className="flex-1 rounded-2xl border border-line bg-white px-5 py-5 text-center shadow-card">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">UAN</p>
                <p className="mt-1 text-lg font-bold text-ink">Arjun M.</p>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-sm text-center text-[15px] leading-relaxed text-muted">
              {hi
                ? "यह एक छोटा सा अंतर है — और दावा अस्वीकृति के सबसे आम कारणों में से एक। हम इसे जमा करने से पहले पकड़ लेते हैं, बाद में समझाने के बजाय।"
                : "It's a small difference — and one of the most common reasons claims get rejected. We catch it before you file, instead of explaining it after."}
            </p>
            <div className="mt-6 flex items-center justify-center">
              <a href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                {hi ? "फ़ाइल करने से पहले ठीक करें" : "See how we catch it"} <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works — a connected rail, not a repeated card grid ─── */}
      <section id="how" className="bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-10 lg:py-28">
          <h2 className="max-w-lg text-3xl font-bold tracking-tight text-ink lg:text-4xl">
            {hi ? "बातचीत से दावा तक, चार चरणों में।" : "From conversation to claim, in four stages."}
          </h2>

          <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "1",
                title: hi ? "आप बताएं" : "Tell us",
                desc: hi ? "अपने शब्दों में बताएं आपको PF क्यों चाहिए। कोई फॉर्म नहीं, कोई शब्दावली नहीं।" : "Say why you need your PF, in your own words. No forms, no jargon to decode first.",
              },
              {
                n: "2",
                title: hi ? "हम जाँचें" : "We check",
                desc: hi ? "आपके आधार, UAN और बैंक विवरण की तुलना करते हैं और समस्याओं को पहले ही पकड़ लेते हैं।" : "We compare your Aadhaar, UAN and bank details, and flag mismatches before they cost you time.",
              },
              {
                n: "3",
                title: hi ? "हम तैयार करें" : "We prepare",
                desc: hi ? "सही दस्तावेज़ मांगते हैं और आपका दावा सही फॉर्मेट में तैयार करते हैं।" : "We ask for exactly the documents your claim needs and prepare it in the right format.",
              },
              {
                n: "4",
                title: hi ? "आप ट्रैक करें" : "You track",
                desc: hi ? "जमा करने के बाद, हर चरण में स्पष्ट भाषा में जानें कि क्या हो रहा है।" : "After you file, plain-language status at every stage — no guessing what EPFO is doing.",
              },
            ].map((step, i, arr) => (
              <div key={i} className="relative pl-0">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl italic text-primary/40">{step.n}</span>
                  <div className="h-px flex-1 bg-line" />
                </div>
                <p className="mt-4 text-lg font-bold text-ink">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.desc}</p>
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
              <h2 className="text-3xl font-bold tracking-tight text-ink lg:text-4xl">
                {hi ? (
                  <>हर चरण <em className="font-serif italic text-primary not-italic">ट्रैक</em> करें। हमेशा जानें आगे क्या है।</>
                ) : (
                  <>Track every step. Always know what's <em className="font-serif italic text-primary not-italic">next</em>.</>
                )}
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

      {/* ─── Closing — full-bleed statement, not a boxed CTA plate ─── */}
      <section className="bg-primary" id="help">
        <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white lg:text-[2.75rem]">
              {hi ? (
                <>अपना PF।<br />बिना <em className="font-serif italic not-italic">अंदाज़े</em> के।</>
              ) : (
                <>Your PF.<br />Without the <em className="font-serif italic not-italic">guesswork</em>.</>
              )}
            </h2>
            <div className="shrink-0">
              <button
                onClick={startClaim}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-canvas"
              >
                <Lock size={16} />
                {hi ? "UAN से लॉगिन करें" : "Login with UAN"}
                <ArrowRight size={16} />
              </button>
              <p className="mt-3 text-xs text-white/60">
                {hi ? "2 मिनट से कम · डेमो वातावरण" : "Under 2 minutes · Demo environment"}
              </p>
            </div>
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
