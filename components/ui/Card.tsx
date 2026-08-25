import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Section({
  title,
  subtitle,
  className,
  children,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {title && <h2 className="text-xl font-semibold text-ink">{title}</h2>}
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      {children}
    </section>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

export function PageHeading({
  title,
  subtitle,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <h1 className="text-[28px] font-bold leading-tight text-ink">{title}</h1>
      {subtitle && <p className="text-[15px] text-muted">{subtitle}</p>}
    </div>
  );
}
