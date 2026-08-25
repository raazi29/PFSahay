import { cn } from "@/lib/cn";

export function ChatBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed animate-fade-in",
          isUser
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md bg-surface text-ink shadow-soft border border-line"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function QuickReply({
  options,
  onSelect,
  disabled,
  variant,
}: {
  options: { key: string; label: string }[];
  onSelect: (key: string, label: string) => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          disabled={disabled}
          onClick={() => onSelect(o.key, o.label)}
          className={
            isPrimary
              ? "rounded-2xl border border-primary bg-primary px-5 py-3.5 text-[15px] font-semibold text-white shadow-soft transition hover:bg-primary-ink disabled:opacity-50"
              : "rounded-full border border-primary/30 bg-primary-soft px-4 py-2.5 text-[14px] font-medium text-primary-ink transition hover:bg-primary hover:text-white disabled:opacity-50"
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface px-4 py-3 shadow-soft border border-line">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
      </div>
    </div>
  );
}

export function ExplanationCard({
  title,
  children,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary-soft p-4 animate-fade-in">
      {title && <p className="mb-1 text-sm font-semibold text-primary-ink">{title}</p>}
      <div className="text-[15px] leading-relaxed text-ink">{children}</div>
    </div>
  );
}
