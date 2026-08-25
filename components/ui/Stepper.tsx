import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Step {
  key: string;
  label: string;
}

export function Stepper({
  steps,
  current,
  className,
}: {
  steps: Step[];
  current: string;
  className?: string;
}) {
  const activeIndex = steps.findIndex((s) => s.key === current);
  return (
    <ol className={cn("flex items-center gap-1", className)} aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <li key={s.key} className="flex flex-1 items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              {/* Circle: completed = green + check, active = brand + number, pending = gray + number */}
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done && "bg-success text-white",
                  active && "bg-brand text-white",
                  !done && !active && "bg-line text-muted"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  active ? "font-medium text-ink" : done ? "text-ink" : "text-muted"
                )}
              >
                {s.label}
              </span>
            </div>
            {/* Connector: completed = dashed green, active = dashed brand, pending = dashed gray */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "mt-[-14px] flex-1 border-t-2 border-dashed",
                  done ? "border-success" : active ? "border-brand" : "border-line"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
