"use client";

export default function PrintButton({ label = "Print / save as PDF" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="btn-primary btn-sm no-print">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z" />
      </svg>
      {label}
    </button>
  );
}
