"use client";

import { useMemo, useState } from "react";
import type { Notice } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

const PAGE_SIZE = 5;
const categories = ["All", "Admission", "Examination", "Result", "Event", "General"] as const;

export default function NoticesBrowser({ notices }: { notices: Notice[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return notices
      .filter((n) => (category === "All" ? true : n.category === category))
      .filter((n) =>
        !query.trim() ? true : (n.title + " " + n.summary + " " + n.body).toLowerCase().includes(query.trim().toLowerCase())
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [notices, category, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              className="input !pl-9"
              placeholder="Search notices, circulars, results…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <p className="text-[12px] text-slate-500">{filtered.length} notices</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`chip ${category === c ? "chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {slice.map((n) => {
            const isOpen = open === n.id;
            return (
              <article key={n.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : n.id)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <div className="hidden w-14 shrink-0 rounded-xl bg-sand py-2 text-center sm:block">
                    <p className="font-display text-lg leading-none text-brand-700">{fmtDate(n.date).slice(0, 2)}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      {new Date(n.date).toLocaleString("en-IN", { month: "short" })}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={n.category === "Admission" ? "badge-green" : n.category === "Result" ? "badge-amber" : "badge-slate"}>
                        {n.category}
                      </span>
                      <span className="text-[11.5px] text-slate-400">{n.id}</span>
                    </div>
                    <h3 className="mt-2 font-semibold leading-snug text-ink">{n.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">{n.summary}</p>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`mt-1 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isOpen ? (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                    <p className="text-[13.5px] leading-relaxed text-slate-700">{n.body}</p>
                    {n.attachment ? (
                      <a href="#" onClick={(e) => e.preventDefault()} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-[12.5px] font-semibold text-slate-700 hover:border-brand-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                          <path d="M5 19h14" />
                        </svg>
                        {n.attachment}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
          {slice.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="font-display text-xl">Nothing here yet</p>
              <p className="muted mt-2">Try another keyword or category.</p>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-[12px] text-slate-500">
            Page {current} of {pages}
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-outline btn-sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
              Previous
            </button>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-full text-[13px] font-semibold ${
                  current === i + 1 ? "bg-brand-600 text-white" : "border border-slate-300 bg-white text-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button className="btn-outline btn-sm" disabled={current === pages} onClick={() => setPage(current + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card p-5">
          <p className="font-display text-lg">Need help?</p>
          <p className="muted mt-2 text-[13px]">
            The admission desk answers calls 9 AM – 7 PM, Monday to Saturday.
          </p>
          <p className="mt-3 text-sm font-semibold text-ink">1800 120 4455</p>
          <p className="text-sm text-slate-600">hello@collegesathi.edu.in</p>
        </div>
        <div className="card bg-brand-900 p-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-400">Session 2026</p>
          <p className="mt-2 font-display text-xl leading-snug">Admissions close on 20 December</p>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-100">
            Start your application today — progress is saved at every step.
          </p>
          <a href="/apply" className="btn-accent btn-sm mt-4">Apply now</a>
        </div>
      </aside>
    </div>
  );
}
