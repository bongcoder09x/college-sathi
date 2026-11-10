"use client";

import { useRef, useState } from "react";
import type { DocumentItem } from "@/lib/types";

export default function FileDrop({
  kind,
  hint,
  required,
  current,
  onUploaded,
  onRemove,
}: {
  kind: string;
  hint: string;
  required?: boolean;
  current?: DocumentItem;
  onUploaded: (doc: DocumentItem) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const send = async (file: File) => {
    setError("");
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      return setError("Only PDF, JPG or PNG files are accepted.");
    }
    if (file.size > 2 * 1024 * 1024) {
      return setError("That file is larger than 2 MB. Please compress it and try again.");
    }
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    const res = await fetch("/api/documents", { method: "POST", body: form });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return setError(data.error || "Upload failed.");
    onUploaded(data.document);
  };

  if (current) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-300 bg-brand-50/60 px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-brand-700">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 12 5 5L20 6" /></svg>
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-ink">{current.fileName}</p>
            <p className="text-[11px] text-slate-500">{(current.size / 1024).toFixed(0)} KB · {current.status}</p>
          </div>
        </div>
        <button onClick={onRemove} className="text-[11.5px] font-semibold text-rose-600 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) send(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-3 py-4 text-center transition ${
          over ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50/60 hover:border-brand-400"
        }`}
      >
        <p className="text-[12.5px] font-semibold text-slate-700">
          {busy ? "Uploading…" : "Drop file here or click to browse"}
          {required ? <span className="text-rose-500"> *</span> : null}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) send(file);
          }}
        />
      </div>
      {error ? <p className="mt-1.5 text-[11.5px] font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
