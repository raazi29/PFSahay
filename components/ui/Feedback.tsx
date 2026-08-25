import { AlertTriangle, CheckCircle2, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-line/60",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        className
      )}
    />
  );
}

export function EmptyState({
  title,
  body,
  icon,
  action,
}: {
  title: string;
  body?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-line/50 text-muted">
        {icon ?? <Inbox size={20} />}
      </div>
      <p className="font-medium text-ink">{title}</p>
      {body && <p className="text-sm text-muted">{body}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  body,
  onRetry,
  retryLabel = "Retry",
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-danger-soft bg-danger-soft/40 p-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle size={20} className="text-danger" />
      </div>
      <p className="font-medium text-ink">{title}</p>
      {body && <p className="text-sm text-muted">{body}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function SuccessState({
  title,
  body,
  icon,
}: {
  title: string;
  body?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-success-soft bg-success-soft/50 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
        {icon ?? <CheckCircle2 size={20} />}
      </div>
      <p className="text-lg font-semibold text-ink">{title}</p>
      {body && <p className="text-sm text-muted">{body}</p>}
    </div>
  );
}
