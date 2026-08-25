"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useClaim } from "@/context/ClaimContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Button } from "@/components/ui/Button";
import {
  LayoutDashboard,
  FileText,
  Bot,
  FolderOpen,
  UserCircle,
  HelpCircle,
  LogOut,
  Users,
  MessageCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { key: "claims", label: "My Claims", icon: FileText, path: null },
  { key: "assistant", label: "Claim Assistant", icon: Bot, path: "/claim" },
  { key: "documents", label: "Documents", icon: FolderOpen, path: "/claim/documents" },
  { key: "kyc", label: "KYC & Profile", icon: UserCircle, path: null },
  { key: "support", label: "Support", icon: HelpCircle, path: null },
] as const;

export function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useClaim();

  return (
    <>
      {/* Logo — teal-green people mark */}
      <div className="px-5 py-5 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-soft">
            <Users size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-ink tracking-tight">PFSahay</p>
            <p className="text-[11px] text-muted leading-tight">Your PF. Simplified.</p>
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
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Need Help? — chat bot */}
      <div className="px-3 pb-1">
        <div className="rounded-2xl bg-brand-soft p-4 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Bot size={24} strokeWidth={2} />
          </div>
          <p className="text-sm font-semibold text-ink">Need Help?</p>
          <p className="mb-3 mt-0.5 text-[11px] leading-snug text-muted">
            Chat with our assistant for instant answers.
          </p>
          <Button variant="brand" size="md" block onClick={() => router.push("/claim")}>
            <MessageCircle size={16} />
            Chat Now
          </Button>
        </div>
      </div>

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
          <button className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors">
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
