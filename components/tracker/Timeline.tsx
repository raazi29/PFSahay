import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ClaimStatusKey } from "@/lib/types";

export interface TimelineStage {
  key: ClaimStatusKey;
  label: string;
}

export function Timeline({
  stages,
  current,
  action,
}: {
  stages: TimelineStage[];
  current: ClaimStatusKey;
  action?: string;
}) {
  const activeIndex = stages.findIndex((s) => s.key === current);
  return (
    <div className="space-y-1">
      <ol className="relative">
        {stages.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={s.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                    done && "bg-success text-white",
                    active && "bg-primary text-white ring-4 ring-primary-soft",
                    !done && !active && "bg-line text-muted"
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                {i < stages.length - 1 && (
                  <span
                    className={cn("my-1 w-0.5 flex-1", i < activeIndex ? "bg-success" : "bg-line")}
                  />
                )}
              </div>
              <div className={cn("pb-5", i === stages.length - 1 && "pb-0")}>
                <p
                  className={cn(
                    "text-[15px] font-medium",
                    active ? "text-ink" : done ? "text-ink" : "text-muted"
                  )}
                >
                  {s.label}
                </p>
                {active && action && <p className="mt-0.5 text-sm text-muted">{action}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
