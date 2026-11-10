"use client";

import { useMemo, useState } from "react";
import type { EventItem } from "@/lib/types";
import { campuses } from "@/lib/data";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const catTone: Record<string, string> = {
  Cultural: "bg-accent-100 text-accent-600",
  Academic: "bg-brand-50 text-brand-700",
  Sports: "bg-sky-50 text-sky-700",
  Career: "bg-violet-50 text-violet-700",
};

export default function EventsView({ events }: { events: EventItem[] }) {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [campus, setCampus] = useState("all");
  const [cursor, setCursor] = useState({ year: 2026, month: 10 }); // Nov 2026 (0-indexed)

  const visible = useMemo(
    () => events.filter((e) => campus === "all" || e.campusSlug === campus).sort((a, b) => (a.date < b.date ? -1 : 1)),
    [events, campus]
  );

  const first = new Date(cursor.year, cursor.month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const iso = (day: number) =>
    `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const eventsOn = (day: number) => visible.filter((e) => e.date === iso(day));
  const spanning = (day: number) =>
    visible.filter((e) => e.endDate && e.date <= iso(day) && e.endDate >= iso(day));

  const shift = (delta: number) => {
    const m = cursor.month + delta;
    setCursor({ year: cursor.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setCampus("all")} className={`chip ${campus === "all" ? "chip-active" : ""}`}>
            All campuses
          </button>
          {campuses.map((c) => (
            <button key={c.slug} onClick={() => setCampus(c.slug)} className={`chip ${campus === c.slug ? "chip-active" : ""}`}>
              {c.shortName}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-full border border-slate-300 bg-white p-1">
          {(["calendar", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold capitalize transition ${
                view === v ? "bg-brand-600 text-white" : "text-slate-600 hover:text-brand-700"
              }`}
            >
              {v} view
            </button>
          ))}
        </div>
      </div>

      {view === "calendar" ? (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="font-display text-xl text-ink">
                {MONTHS[cursor.month]} {cursor.year}
              </p>
              <p className="text-[12px] text-slate-500">{visible.length} events this session</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => shift(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 text-slate-600 hover:border-brand-400" aria-label="Previous month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
              </button>
              <button onClick={() => shift(1)} className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 text-slate-600 hover:border-brand-400" aria-label="Next month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70">
            {DOW.map((d) => (
              <div key={d} className="px-2 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-500">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const dayEvents = day ? eventsOn(day) : [];
              const multi = day ? spanning(day) : [];
              const isToday = day === 10 && cursor.month === 10 && cursor.year === 2026;
              return (
                <div
                  key={i}
                  className={`min-h-[92px] border-b border-r border-slate-100 p-1.5 ${day ? "bg-white" : "bg-slate-50/50"}`}
                >
                  {day ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span
                          className={`grid h-6 w-6 place-items-center rounded-full text-[12px] font-semibold ${
                            isToday ? "bg-accent-500 text-white" : "text-slate-500"
                          }`}
                        >
                          {day}
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((e) => (
                          <div key={e.id} className={`truncate rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${catTone[e.category] || "bg-slate-100 text-slate-600"}`} title={e.title}>
                            {e.title}
                          </div>
                        ))}
                        {multi.length && dayEvents.length === 0 ? (
                          <div className="truncate rounded bg-brand-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-brand-700" title={multi[0].title}>
                            {multi[0].title}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((e) => {
            const d = new Date(e.date);
            return (
              <article key={e.id} className="card card-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="flex w-20 shrink-0 flex-col items-center rounded-xl bg-sand py-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    {d.toLocaleString("en-IN", { month: "short" })}
                  </span>
                  <span className="font-display text-2xl leading-none text-brand-700">{d.getDate()}</span>
                  <span className="mt-1 text-[10px] text-slate-500">{d.getFullYear()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`badge ${catTone[e.category] || "badge-slate"}`}>{e.category}</span>
                    <span className="text-[11.5px] text-slate-400">{e.time}</span>
                  </div>
                  <h3 className="mt-1.5 font-semibold text-ink">{e.title}</h3>
                  <p className="text-[13px] text-slate-600">{e.description}</p>
                  <p className="mt-1 text-[12px] text-slate-500">{e.venue}</p>
                </div>
                <a href="/contact" className="btn-outline btn-sm shrink-0">Ask about this</a>
              </article>
            );
          })}
          {visible.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="font-display text-xl">No events on this campus yet</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
