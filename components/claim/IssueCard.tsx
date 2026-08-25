import { Check, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ValidationIssue } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/Badge";

export interface CheckItem {
  label: string;
  ok: boolean;
  detail?: string;
}

export function ValidationChecklist({ items }: { items: CheckItem[] }) {
  return (
    <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((it) => (
        <li key={it.label} className="flex items-start gap-3 px-4 py-3">
          <span
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm",
              it.ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
            )}
            aria-hidden
          >
            {it.ok ? <Check size={12} strokeWidth={3} /> : <AlertTriangle size={12} />}
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-medium text-ink">{it.label}</p>
            {it.detail && <p className="text-sm text-muted">{it.detail}</p>}
          </div>
          <Badge tone={it.ok ? "success" : "warning"}>
            {it.ok ? "OK" : "Check"}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

export function IssueCard({
  issue,
  onFix,
}: {
  issue: ValidationIssue;
  onFix?: () => void;
}) {
  const { t } = useLanguage();
  const tone =
    issue.severity === "error"
      ? "danger"
      : issue.severity === "warning"
        ? "warning"
        : "neutral";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <Badge tone={tone as "danger" | "warning" | "neutral"}>
          {issue.resolved ? t("issueResolvedBadge") : "Attention"}
        </Badge>
        {issue.resolved && (
          <span className="flex items-center gap-1 text-sm font-medium text-success">
            <CheckCircle2 size={14} /> {t("issueResolvedBadge") || "Resolved"}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-ink">{t("issueTitle")}</h3>
      <p className="mt-1 text-[15px] text-muted">{t("issueBody")}</p>

      <div className="mt-4 space-y-2 rounded-xl bg-canvas p-3">
        <Row label={issue.sourceA} value={issue.valueA} />
        <Row label={issue.sourceB} value={issue.valueB} highlight={!issue.resolved} />
      </div>

      {!issue.resolved ? (
        <button
          onClick={onFix}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-3.5 text-base font-medium text-white hover:bg-primary-ink"
        >
          {t("issueFix")}
        </button>
      ) : (
        <p className="mt-4 rounded-xl bg-success-soft px-4 py-3 text-sm text-success">
          {t("issueFixBody")}
        </p>
      )}
    </div>
  );
}

function Row({
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
          "text-[15px] font-medium",
          highlight ? "text-warning" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}
