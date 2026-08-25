import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function TextInput({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-xl border bg-surface px-4 py-3 text-[16px] text-ink outline-none transition",
          "min-h-[48px] placeholder:text-muted/70",
          error ? "border-danger" : "border-line focus:border-primary",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  hint,
  error,
  className,
  id,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
}) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full rounded-xl border bg-surface px-4 py-3 text-[16px] text-ink outline-none transition",
          "min-h-[96px] placeholder:text-muted/70",
          error ? "border-danger" : "border-line focus:border-primary",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function UANInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <TextInput
      name="uan"
      inputMode="numeric"
      maxLength={12}
      placeholder="e.g. 100000000001"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 12))}
      error={error}
      aria-label="Universal Account Number"
    />
  );
}
