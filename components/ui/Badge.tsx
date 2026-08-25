import { cn } from "@/lib/cn";
import type { ClaimStatusKey } from "@/lib/types";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger";

const toneClass: Record<Tone, string> = {
  neutral: "bg-canvas text-muted",
  primary: "bg-primary-soft text-primary-ink",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const statusTone: Record<ClaimStatusKey, Tone> = {
  submitted: "primary",
  under_verification: "warning",
  query_raised: "danger",
  approved: "success",
  disbursed: "success",
};

const statusLabel: Record<ClaimStatusKey, string> = {
  submitted: "Submitted",
  under_verification: "Under verification",
  query_raised: "Query raised",
  approved: "Approved",
  disbursed: "Disbursed",
};

export function StatusBadge({ status }: { status: ClaimStatusKey }) {
  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
}
