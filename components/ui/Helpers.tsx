import { cn } from "@/lib/cn";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          highlight ? "text-primary font-bold" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function SummaryRowBordered({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: any;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-line last:border-0">
      <Icon size={16} className="text-muted shrink-0" />
      <span className="flex-1 text-sm text-muted">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          highlight ? "text-primary font-bold" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function HelpRow({
  icon: Icon,
  title,
  sub,
}: {
  icon: any;
  title: string;
  sub: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface transition-colors">
      <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
        <Icon size={16} className="text-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <ArrowRight size={14} className="text-muted/50" />
    </button>
  );
}

export function ReviewField({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p
        className={cn(
          "text-sm font-medium mt-0.5",
          highlight ? "text-primary" : "text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function CheckItem({
  label,
  sub,
}: {
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded-full bg-success flex items-center justify-center">
        <CheckCircle2 size={12} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
    </div>
  );
}

export function ShareRow({
  icon: Icon,
  label,
  sub,
}: {
  icon: any;
  label: string;
  sub: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface transition-colors">
      <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
        <Icon size={16} className="text-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <ArrowRight size={14} className="text-muted/50" />
    </button>
  );
}
