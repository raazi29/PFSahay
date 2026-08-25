"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { DemoControls } from "@/components/DemoControls";
import { SidebarContent } from "@/components/layout/Sidebar";
import { Menu, ArrowLeft } from "lucide-react";

const MobileMenuContext = createContext<{ openMenu: () => void }>({ openMenu: () => {} });

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

export function AppShell({ children, topBar = true }: { children: React.ReactNode; topBar?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ openMenu: () => setMenuOpen(true) }}>
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-line bg-surface h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile overlay sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-surface shadow-card animate-fade-in flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        {topBar && (
          <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-soft"
            >
              <Menu size={18} />
            </button>
            <div className="flex-1 text-center">
              <span className="text-base font-bold text-brand">PFSahay</span>
            </div>
            <LanguageToggle />
          </header>
        )}

        {children}
      </div>

      <DemoControls />
    </div>
    </MobileMenuContext.Provider>
  );
}

export function Header({
  title,
  onBack,
  showLang = true,
  right,
}: {
  title?: React.ReactNode;
  onBack?: () => void;
  showLang?: boolean;
  right?: React.ReactNode;
}) {
  const { openMenu } = useMobileMenu();
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-surface transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
      ) : (
        <button
          onClick={openMenu}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-soft"
        >
          <Menu size={18} />
        </button>
      )}
      <div className="flex-1 truncate text-center text-sm font-semibold text-ink">
        {title}
      </div>
      {right ?? (showLang ? <LanguageToggle /> : <span className="w-9" />)}
    </header>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-5 w-full", className)}>
      {children}
    </main>
  );
}

export function ScreenBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Back"
      className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-soft"
    >
      <ArrowLeft size={18} />
    </button>
  );
}
