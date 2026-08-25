"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { ClaimProvider } from "@/context/ClaimContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ClaimProvider>{children}</ClaimProvider>
    </LanguageProvider>
  );
}
