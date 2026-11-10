"use client";

import { useState } from "react";
import PortalShell, { academicsNav } from "@/components/PortalShell";
import { builderDays, builderSlots, department, publishedTimetable } from "@/lib/portals";
import { saveBuilder, useStaffStore } from "@/lib/staffStore";

const palette = [
  { label: "CSE501 · 5A", faculty: "Dr. A. Sengupta", hours: 4 },
  { label: "CSE502 · 5A", faculty: "Prof. R. Mitra", hours: 3 },
  { label: "CSE503 · 5A", faculty: "Dr. S. Kar", hours: 3 },
  { label: "CSE504 · 5A", faculty: "Dr. P. Ghosh", hours: 3 },
  { label: "CSE505 · 5A", faculty: "Prof. M. Bose", hours: 4 },
];

const emptyGrid = () =>
  builderDays.reduce<Record<string, string[]>>((acc, d) => {
    acc[d] = builderSlots.map(() => "");
    return acc;
  }, {});

export default function TimetableBuilderPage() {
  const store = useStaffStore();
  const [grid, setGrid] = useState<Record<string, string[]>>(store.builder || emptyGrid());
  const [drag, setDrag] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [constraints, setConstraints] = useState({ rooms: "12 rooms · 3 labs", maxHours: 4, avoidFriday: true });
  const [msg, setMsg] = useState("");

  const counts = palette.map((p) => ({
    ...p,
    placed: builderDays.reduce((s, d) => s + grid[d].filter((c) => c.startsWith(p.label)).length, 0),
  }));

  const clashes = (() => {
    const out: string[] = [];
    counts.forEach((c) => {
      if (c.placed > c.hours) out.push(`${c.label} scheduled ${c.placed}× but needs ${c.hours}`);
    });
    builderDays.forEach((d) => {
      const perFaculty: Record<string, number> = {};
      grid[d].forEach((cell) => {
        const p = palette.find((x) => cell.startsWith(x.label));
        if (!p) return;
        perFaculty[p.faculty] = (perFaculty[p.faculty] || 0) + 1;
      });
      Object.entries(perFaculty).forEach(([f, n]) => {
        if (n > constraints.maxHours) out.push(`${f} has ${n} classes on ${d} (max ${constraints.maxHours})`);
      });
      if (constraints.avoidFriday && d === "Fri" && grid[d].filter(Boolean).length > 3) out.push("Friday is over-booked (3 slots max)");
    });
    return out;
  })();

  const autoGenerate = () => {
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        clearInterval(timer);
        setProgress(100);
        setGrid(publishedTimetable);
        setMsg("Draft generated from constraints — review clashes before publishing.");
      } else {
        setProgress(Math.round(p));
      }
    }, 260);
  };

  return (
    <PortalShell
      title="Timetable builder"
      subtitle="Constraints → auto-generate → drag-drop edit → publish"
      groups={academicsNav}
      person={{ name: department.hod, sub: "HOD · Computer Science" }}
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-lg">Grid editor</p>
                <p className="text-[11px] text-slate-500">Drag a subject from the palette into a slot · click a slot to clear</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={autoGenerate} className="btn-outline btn-sm">Auto-generate</button>
                <button onClick={() => { saveBuilder(grid, false); setMsg("Draft saved."); }} className="btn-outline btn-sm">Save draft</button>
                <button onClick={() => { saveBuilder(grid, true); setMsg("Timetable published as v4."); }} className="btn-primary btn-sm">Publish</button>
              </div>
            </div>

            {progress !== null && progress < 100 ? (
              <div className="mt-3">
                <div className="flex justify-between text-[10.5px] text-slate-500">
                  <span>Generating…</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige/70">
                  <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : null}

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[11.5px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-slate-400">
                    <th className="px-2 py-2">Slot</th>
                    {builderDays.map((d) => (
                      <th key={d} className="px-2 py-2">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {builderSlots.map((slot, si) => (
                    <tr key={slot} className="border-t border-beige/60">
                      <td className="px-2 py-2 font-semibold text-slate-500">{slot}</td>
                      {builderDays.map((d) => {
                        const cell = grid[d][si];
                        const clash = counts.some((c) => cell.startsWith(c.label) && c.placed > c.hours);
                        return (
                          <td key={d} className="px-1 py-1">
                            <div
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                if (!drag) return;
                                setGrid((g) => ({ ...g, [d]: g[d].map((c, ci) => (ci === si ? drag : c)) }));
                                setDrag(null);
                              }}
                              onClick={() => setGrid((g) => ({ ...g, [d]: g[d].map((c, ci) => (ci === si ? "" : c)) }))}
                              className={`min-h-[42px] cursor-pointer rounded-lg border px-2 py-1.5 transition ${
                                clash ? "border-brand-500 bg-brand-50 text-brand-800" : cell ? "border-beige bg-ivory/70 text-ink" : "border-dashed border-beige bg-slate-50/60 text-slate-400"
                              }`}
                            >
                              {cell || "drop here"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {clashes.length ? (
              <div className="mt-3 rounded-xl border border-brand-300 bg-brand-50/60 p-3">
                <p className="text-[11.5px] font-semibold text-brand-800">{clashes.length} clash(es) detected</p>
                <ul className="mt-1 space-y-0.5 text-[11px] text-brand-700">
                  {clashes.slice(0, 4).map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 rounded-xl bg-brand-50/60 px-3 py-2 text-[11px] text-brand-800">No clashes in the current grid.</p>
            )}
            {msg ? <p className="mt-2 text-[11px] text-slate-600">{msg}</p> : null}
            <p className="mt-2 text-[10.5px] text-slate-500">Current version: {store.builderVersion}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Palette</p>
            <ul className="mt-2 space-y-1.5">
              {counts.map((p) => (
                <li
                  key={p.label}
                  draggable
                  onDragStart={() => setDrag(p.label)}
                  className={`cursor-grab rounded-xl border px-2.5 py-2 text-[11px] ${p.placed > p.hours ? "border-brand-400 bg-brand-50 text-brand-800" : "border-beige bg-ivory/70 text-slate-700"}`}
                >
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-[10px] text-slate-500">{p.faculty} · {p.placed}/{p.hours} h</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Constraints</p>
            <div className="mt-2 space-y-2 text-[11.5px]">
              <div>
                <label className="label">Rooms</label>
                <input className="input h-8 py-1" value={constraints.rooms} onChange={(e) => setConstraints({ ...constraints, rooms: e.target.value })} />
              </div>
              <div>
                <label className="label">Max hours / faculty / day</label>
                <input
                  className="input h-8 py-1"
                  type="number"
                  value={constraints.maxHours}
                  onChange={(e) => setConstraints({ ...constraints, maxHours: Number(e.target.value) || 1 })}
                />
              </div>
              <label className="flex items-center gap-2 text-[11.5px] text-slate-600">
                <input
                  type="checkbox"
                  checked={constraints.avoidFriday}
                  onChange={(e) => setConstraints({ ...constraints, avoidFriday: e.target.checked })}
                  className="h-3.5 w-3.5 accent-brand-600"
                />
                Keep Friday light
              </label>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
