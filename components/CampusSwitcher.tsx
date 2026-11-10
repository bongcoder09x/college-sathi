"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { campuses } from "@/lib/data";
import { CAMPUS_COOKIE } from "@/lib/constants";

export default function CampusSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 py-1.5 pl-3 pr-2 text-[13px] shadow-sm">
      <span className="text-slate-400" aria-hidden>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </span>
      <span className="sr-only">Choose campus</span>
      <select
        aria-label="Choose campus"
        value={current}
        disabled={pending}
        onChange={(e) => {
          document.cookie = `${CAMPUS_COOKIE}=${e.target.value}; path=/; max-age=31536000; samesite=lax`;
          startTransition(() => router.refresh());
        }}
        className="cursor-pointer appearance-none bg-transparent pr-1 font-semibold text-ink outline-none"
      >
        {campuses.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.shortName}
          </option>
        ))}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
