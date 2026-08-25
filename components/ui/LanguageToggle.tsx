"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/cn";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const options = [
    { key: "en" as const, label: "English" },
    { key: "hi" as const, label: "हिंदी" },
  ];
  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-line bg-surface p-0.5 text-sm",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => setLang(o.key)}
          aria-pressed={lang === o.key}
          className={cn(
            "rounded-full px-3 py-1 font-medium transition-colors",
            lang === o.key ? "bg-primary text-white" : "text-muted hover:text-ink"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
