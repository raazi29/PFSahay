"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  ShieldCheck,
  Bell,
  ChevronDown,
  UserCircle,
  BookOpen,
  HelpCircle,
  LogOut,
} from "lucide-react";

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

// "100% Secure — Your data is safe with us" badge shown on every authenticated page header.
export function SecureBadge({ lang }: { lang: string }) {
  return (
    <div className="hidden items-center gap-2 sm:flex">
      <ShieldCheck size={18} className="text-success" />
      <div className="leading-tight">
        <p className="text-[13px] font-semibold text-ink">
          {lang === "hi" ? "100% सुरक्षित" : "100% Secure"}
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-success align-middle" />
        </p>
        <p className="text-[11px] text-muted">
          {lang === "hi" ? "आपका डेटा सुरक्षित है" : "Your data is safe with us"}
        </p>
      </div>
    </div>
  );
}

const dotTone: Record<string, string> = {
  warning: "bg-warning",
  success: "bg-success",
  info: "bg-brand",
};

export function NotificationBell({ lang, bankLinked }: { lang: string; bankLinked: boolean }) {
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
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-brand/20 hover:text-ink"
      >
        <Bell size={18} />
        {items.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-surface">
            {items.length}
          </span>
        )}
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

export function UserMenu({
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
  const router = useRouter();
  const { open, setOpen, ref } = useDropdown();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={lang === "hi" ? "उपयोगकर्ता मेनू" : "User menu"}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-1 pr-2 transition-colors hover:border-brand/20"
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
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
            />
            <MenuItem
              icon={BookOpen}
              label={lang === "hi" ? "पासबुक डाउनलोड करें" : "Download Passbook"}
              onClick={() => setOpen(false)}
            />
            <MenuItem
              icon={HelpCircle}
              label={lang === "hi" ? "सहायता" : "Support"}
              onClick={() => {
                setOpen(false);
                router.push("/support");
              }}
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

// Full top-right cluster used on every authenticated page's desktop header row.
export function TopBarActions({
  lang,
  bankLinked,
  name,
  uan,
  onLogout,
}: {
  lang: string;
  bankLinked: boolean;
  name: string;
  uan: string;
  onLogout: () => void;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex shrink-0 items-center gap-3">
      <SecureBadge lang={lang} />
      <NotificationBell lang={lang} bankLinked={bankLinked} />
      <UserMenu name={name} uan={uan} initials={initials} lang={lang} onLogout={onLogout} />
    </div>
  );
}
