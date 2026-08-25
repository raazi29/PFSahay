"use client";

import { cn } from "@/lib/cn";

interface OTPInputProps {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: boolean;
  disabled?: boolean;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  error,
  disabled,
}: OTPInputProps) {
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function setDigit(index: number, d: string) {
    const next = digits.slice();
    next[index] = d;
    onChange(next.join("").replace(/\D/g, "").slice(0, length));
  }

  return (
    <div className="flex gap-2" role="group" aria-label="OTP code">
      {digits.map((d, i) => (
        <input
          key={i}
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          aria-invalid={error}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            if (v) {
              setDigit(i, v.slice(-1));
              const next = e.target.nextElementSibling as HTMLInputElement | null;
              if (next && v) next.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i]) {
              const prev = e.currentTarget.previousElementSibling as HTMLInputElement | null;
              if (prev) {
                prev.focus();
                setDigit(i - 1, "");
              }
            }
          }}
          className={cn(
            "h-14 w-12 rounded-xl border bg-surface text-center text-2xl font-semibold text-ink outline-none transition",
            error ? "border-danger" : "border-line focus:border-primary"
          )}
        />
      ))}
    </div>
  );
}
