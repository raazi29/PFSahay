import { cn } from "@/lib/cn";

type Variant = "primary" | "brand" | "secondary" | "text" | "danger";
type Size = "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  // Main CTAs — deep navy (#1B2E4B)
  primary: "bg-primary text-white hover:bg-primary-ink active:bg-primary-ink",
  // Action buttons (Claim/Withdraw, Submit, Chat Now) — teal-green brand (#2D8B6E)
  brand: "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark",
  // Outlined
  secondary: "bg-surface text-ink border border-line hover:bg-canvas active:bg-canvas",
  text: "bg-transparent text-primary hover:underline",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  md: "text-[15px] px-4 py-2.5 min-h-[44px]",
  lg: "text-base px-5 py-3.5 min-h-[48px]",
};

export function Button({
  variant = "primary",
  size = "lg",
  block,
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], block && "w-full", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export function PrimaryButton(props: ButtonProps) {
  return <Button variant="primary" {...props} />;
}
export function BrandButton(props: ButtonProps) {
  return <Button variant="brand" {...props} />;
}
export function SecondaryButton(props: ButtonProps) {
  return <Button variant="secondary" {...props} />;
}
export function TextButton(props: ButtonProps) {
  return <Button variant="text" size="md" {...props} />;
}
