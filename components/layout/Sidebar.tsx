"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useClaim } from "@/context/ClaimContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import {
  LayoutDashboard,
  FileText,
  Bot,
  FolderOpen,
  UserCircle,
  HelpCircle,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", en: "Dashboard", hi: "डैशबोर्ड", icon: LayoutDashboard, path: "/dashboard" },
  { key: "claims", en: "My Claims", hi: "मेरे दावे", icon: FileText, path: "/claims" },
  { key: "assistant", en: "Claim Assistant", hi: "दावा सहायक", icon: Bot, path: "/claim" },
  { key: "documents", en: "Documents", hi: "दस्तावेज़", icon: FolderOpen, path: "/claim/documents" },
  { key: "kyc", en: "KYC & Profile", hi: "KYC और प्रोफ़ाइल", icon: UserCircle, path: "/profile" },
  { key: "support", en: "Support", hi: "सहायता", icon: HelpCircle, path: "/support" },
] as const;

export function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useClaim();
  const { lang } = useLanguage();

  return (
    <>
      {/* Logo — indigo brand mark */}
      <div className="px-5 py-5 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-soft text-base font-bold">
            P
          </div>
          <div>
            <p className="text-[15px] font-bold text-ink tracking-tight">PFSahay</p>
            <p className="text-[11px] text-muted leading-tight">
              {lang === "hi" ? "आपका PF। सरल।" : "Your PF. Simplified."}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            item.path && (pathname === item.path || pathname.startsWith(item.path + "/"));
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => item.path && router.push(item.path)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all duration-150",
                active
                  ? "bg-brand/10 text-brand"
                  : "text-muted hover:bg-surface hover:text-ink"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              {lang === "hi" ? item.hi : item.en}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-line px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">
            {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{user.name}</p>
            <p className="text-[11px] text-muted">UAN: {user.uan}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <LanguageToggle />
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors"
          >
            <LogOut size={13} />
            {lang === "hi" ? "लॉगआउट" : "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}
