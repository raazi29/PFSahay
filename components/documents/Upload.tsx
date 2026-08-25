"use client";

import { useRef, useState } from "react";
import type { DocumentItem } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/cn";
import { FileText, CheckCircle2, Upload, X, RefreshCw, Camera } from "lucide-react";

const MAX_BYTES = 5 * 1024 * 1024;

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
        "flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition",
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
      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl",
          doc.uploaded ? "bg-success/10" : "bg-accent-soft"
        )}
      >
        {doc.uploaded ? (
          <CheckCircle2 size={24} className="text-success" />
        ) : (
          <FileText size={24} className="text-accent" />
        )}
      </div>

      {/* Label + required / optional badge */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <p className="text-[15px] font-semibold text-ink">
          {doc.uploaded ? doc.label : `${t("docsUpload")} ${doc.label}`}
        </p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
            doc.required ? "bg-warning/10 text-warning" : "bg-muted/10 text-muted"
          )}
        >
          {doc.required ? t("docsRequired") : t("docsOptional")}
        </span>
      </div>

      {doc.uploaded ? (
        <div className="mt-1 flex flex-col items-center gap-2">
          <p className="flex items-center gap-1.5 text-sm font-medium text-success">
            <CheckCircle2 size={14} />
            {t("docsUploaded")}: {doc.fileName}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface"
            >
              <RefreshCw size={12} />
              {lang === "hi" ? "बदलें" : "Replace"}
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 rounded-lg border border-danger/20 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger-soft"
              >
                <X size={12} />
                {lang === "hi" ? "हटाएं" : "Remove"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted">
            {lang === "hi"
              ? "यहाँ खींचें और छोड़ें, या नीचे से चुनें"
              : "Drag & drop here, or select below"}
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
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
        <p role="alert" className="mt-1 text-sm font-medium text-danger">
          {error}
        </p>
      )}

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
