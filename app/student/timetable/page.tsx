"use client";

import { useState } from "react";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { periods, timetable, todayClasses } from "@/lib/portal";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function TimetablePage() {
  const [view, setView] = useState<"week" | "day">("week");

  const exportIcs = () => {
    const stamp = (dayIdx: number, time: string) => {
      const [hh, mm] = time.slice(0, 5).split(":");
      const d = new Date(2026, 10, 9 + dayIdx, Number(hh), Number(mm));
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//College Sathi//Timetable//EN"];
    days.forEach((day, di) => {
      (timetable[day] || []).forEach((slot, si) => {
        if (slot.kind === "free") return;
        lines.push(
          "BEGIN:VEVENT",
          `UID:${day}-${si}@collegesathi.edu.in`,
          `DTSTAMP:${stamp(di, periods[si].slice(0, 5))}`,
          `DTSTART:${stamp(di, periods[si].slice(0, 5))}`,
          `SUMMARY:${slot.subject}`,
          `LOCATION:${slot.room}`,
          "END:VEVENT"
        );
      });
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "college-sathi-timetable.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PortalShell title="Timetable" subtitle="Semester 5 · Section A · Main Campus" groups={studentNav}>
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-beige bg-ivory/60 p-1">
            {(["week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold capitalize ${view === v ? "bg-brand-600 text-ivory" : "text-slate-600"}`}
              >
                {v} view
              </button>
            ))}
          </div>
          <button onClick={exportIcs} className="btn-outline btn-sm">Export .ics</button>
        </div>

        {view === "week" ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[12px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-slate-400">
                  <th className="px-2 py-2">Time</th>
                  {days.map((d) => (
                    <th key={d} className="px-2 py-2">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p, pi) => (
                  <tr key={p} className="border-t border-beige/60">
                    <td className="px-2 py-2 align-top font-semibold text-slate-500">{p}</td>
                    {days.map((d) => {
                      const slot = timetable[d][pi];
                      return (
                        <td key={d} className="px-1.5 py-1.5 align-top">
                          <div className={`rounded-lg px-2 py-1.5 ${slot.kind === "lab" ? "bg-accent-50" : slot.kind === "free" ? "bg-slate-50" : "bg-ivory/70"} border border-beige/60`}>
                            <p className="font-medium leading-snug text-ink">{slot.subject}</p>
                            <p className="text-[10px] text-slate-500">{slot.room}</p>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {todayClasses.map((c) => (
              <li key={c.time} className="flex items-center gap-3 rounded-xl border border-beige/70 bg-ivory/50 p-3">
                <span className="w-16 shrink-0 font-display text-base text-brand-700">{c.time}</span>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-ink">{c.subject}</p>
                  <p className="text-[11px] text-slate-500">{c.room} · {c.faculty}</p>
                </div>
                <span className="badge-slate">{c.status}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-[11px] text-slate-500">
          Lab slots run for two hours. Mentor hour and library time are self-scheduled.
        </p>
      </div>
    </PortalShell>
  );
}
