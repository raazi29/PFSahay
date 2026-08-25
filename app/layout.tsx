import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "PFSahay — Claim your PF without the confusion",
  description:
    "AI-Powered EPF Claim & Withdrawal Assistant. Tell PFSahay why you need your money and it prepares an error-checked mock claim.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F7F9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
