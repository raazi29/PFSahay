"use client";

import { useEffect, useRef, useState } from "react";
import type { DocumentItem } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/cn";
import {
  FileText,
  CheckCircle2,
  Upload,
  X,
  RefreshCw,
  Camera,
  IdCard,
  Landmark,
  Check,
  MoreVertical,
} from "lucide-react";

const MAX_BYTES = 5 * 1024 * 1024;

// Per-document icon language — keyed by DocumentItem.id (see lib/mock-data/user.ts).
// Falls back to a generic file icon for any unrecognized id.
const DOC_ICONS: Record<string, { icon: any; bg: string; text: string }> = {
  identity: { icon: IdCard, bg: "bg-brand-soft", text: "text-brand" },
  cancelled_cheque: { icon: Landmark, bg: "bg-accent-soft", text: "text-accent" },
  supporting: { icon: FileText, bg: "bg-primary/10", text: "text-primary" },
};

function getDocIcon(id: string) {
  return DOC_ICONS[id] ?? { icon: FileText, bg: "bg-accent-soft", text: "text-accent" };
}

// Small open/close-on-outside-click hook for the "•••" overflow menu, mirroring
// the pattern used by components/layout/TopBar.tsx's useDropdown.
function useOverflowMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return { open, setOpen, ref };
}

export function UploadZone({
  doc,
  onUploaded,
  onRemove,
}: {
  doc: DocumentItem;
  onUploaded: (fileName: string) => void;
  onRemove?: () => void;
}) {
  const { t, lang } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const menu = useOverflowMenu();

  const { icon: DocIcon, bg: iconBg, text: iconText } = getDocIcon(doc.id);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const okType = file.type === "application/pdf" || file.type.startsWith("image/");
    if (!okType || file.size > MAX_BYTES) {
      setError(t("docsInvalid"));
      return;
    }
    setError(undefined);
    onUploaded(file.name);
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dashed p-4 transition sm:p-5",
        doc.uploaded ? "border-success/40 bg-success-soft/50" : "border-line bg-surface",
        dragging && !doc.uploaded && "border-accent bg-accent-soft"
      )}
      role="group"
      aria-label={`${doc.label} upload`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex items-start gap-3">
        {/* Doc-type icon swatch, with a small "uploaded" checkmark badge */}
        <div className="relative shrink-0">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", iconBg)}>
            <DocIcon size={20} className={iconText} />
          </div>
          {doc.uploaded && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-white ring-2 ring-surface">
              <Check size={10} strokeWidth={3} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Label + required / optional badge + overflow menu */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="truncate text-[15px] font-semibold text-ink">{doc.label}</p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  doc.required ? "bg-warning/10 text-warning" : "bg-muted/10 text-muted"
                )}
              >
                {doc.required ? t("docsRequired") : t("docsOptional")}
              </span>
            </div>

            {doc.uploaded && (
              <div ref={menu.ref} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => menu.setOpen((o) => !o)}
                  aria-label={lang === "hi" ? "अधिक विकल्प" : "More options"}
                  aria-haspopup="menu"
                  aria-expanded={menu.open}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  <MoreVertical size={16} />
                </button>
                {menu.open && (
                  <div
                    role="menu"
                    className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-line bg-surface p-1.5 shadow-card animate-fade-in"
                  >
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        menu.setOpen(false);
                        inputRef.current?.click();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-ink transition-colors hover:bg-canvas"
                    >
                      <RefreshCw size={13} className="text-muted" />
                      {lang === "hi" ? "बदलें" : "Replace"}
                    </button>
                    {onRemove && (
                      <button
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          menu.setOpen(false);
                          onRemove();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-danger transition-colors hover:bg-danger-soft"
                      >
                        <X size={13} />
                        {lang === "hi" ? "हटाएं" : "Remove"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {doc.uploaded ? (
            <div className="mt-2 space-y-2">
              <p className="flex items-center gap-1.5 text-sm font-medium text-success">
                <CheckCircle2 size={14} className="shrink-0" />
                {t("docsUploaded")}
              </p>
              {/* Thumbnail-style file preview chip */}
              <div className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-line bg-canvas px-2.5 py-1.5">
                <FileText size={14} className="shrink-0 text-muted" />
                <span className="truncate text-xs text-ink">{doc.fileName}</span>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1 text-xs text-muted">
                {lang === "hi"
                  ? "यहाँ खींचें और छोड़ें, या नीचे से चुनें"
                  : "Drag & drop here, or select below"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* Choose File — orange (accent) */}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <Upload size={14} />
                  {t("docsChooseFile")}
                </button>
                {/* Take Photo — outlined orange */}
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <Camera size={14} />
                  {t("docsTakePhoto")}
                </button>
              </div>
            </>
          )}

          {error && (
            <p role="alert" className="mt-2 text-sm font-medium text-danger">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,application/pdf"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraRef}
        type="file"
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

export function DocumentCard({
  doc,
  onUploaded,
}: {
  doc: DocumentItem;
  onUploaded: (fileName: string) => void;
}) {
  return <UploadZone doc={doc} onUploaded={onUploaded} />;
}

export function FilePreview({ name, onRemove }: { name: string; onRemove?: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
      <span className="truncate text-[15px] text-ink">{name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-3 rounded-lg p-1 text-muted hover:bg-danger-soft hover:text-danger transition-colors"
          aria-label="Remove file"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
