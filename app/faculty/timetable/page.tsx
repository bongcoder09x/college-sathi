"use client";

import { useState } from "react";
import PortalShell, { facultyNav } from "@/components/PortalShell";
import { faculty, facultyTimetable, substitutions } from "@/lib/portals";
import { periods } from "@/lib/portal";

export default function FacultyTimetablePage() {
  const [request, setRequest] = useState({ date: "", slot: "", reason: "" });
  const [msg, setMsg] = useState("");

  return (
    <PortalShell
      title="My timetable"
      subtitle="Semester 5 · CSE · substitutions and swaps"
      groups={facultyNav}
      person={{ name: faculty.name, sub: `${faculty.code} · Faculty` }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="card p-5">
          <p className="font-display text-lg">Weekly grid</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[12px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-slate-400">
                  <th className="px-2 py-2">Time</th>
                  {facultyTimetable.map((d) => (
                    <th key={d.day} className="px-2 py-2">{d.day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p, pi) => (
                  <tr key={p} className="border-t border-beige/60">
                    <td className="px-2 py-2 font-semibold text-slate-500">{p.split(" – ")[0]}</td>
                    {facultyTimetable.map((d) => (
                      <td key={d.day} className="px-1.5 py-1.5">
                        <div className={`rounded-lg border border-beige/60 px-2 py-1.5 text-[11px] ${d.slots[pi] === "—" ? "bg-slate-50 text-slate-400" : "bg-ivory/70 text-ink"}`}>
                          {d.slots[pi]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Timetable v3 · published 02/11/2026 by the department.</p>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Request a substitution / swap</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!request.date || !request.reason) return setMsg("Add a date and reason.");
                setMsg("Request sent to the HoD for approval.");
                setRequest({ date: "", slot: "", reason: "" });
              }}
              className="mt-3 space-y-2"
            >
              <input type="date" className="input" value={request.date} onChange={(e) => setRequest({ ...request, date: e.target.value })} />
              <select className="input" value={request.slot} onChange={(e) => setRequest({ ...request, slot: e.target.value })}>
                <option value="">Select a slot</option>
                {periods.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <textarea rows={2} className="input resize-none" placeholder="Reason" value={request.reason} onChange={(e) => setRequest({ ...request, reason: e.target.value })} />
              <button className="btn-primary btn-sm w-full">Send request</button>
              {msg ? <p className="text-[11px] text-brand-700">{msg}</p> : null}
            </form>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">My requests</p>
            <ul className="mt-3 space-y-2">
              {substitutions.map((s) => (
                <li key={s.id} className="rounded-xl border border-beige/70 bg-ivory/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11.5px] font-semibold text-ink">{s.slot}</p>
                    <span className={s.status === "Approved" ? "badge-green" : "badge-amber"}>{s.status}</span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-slate-500">{s.date} · {s.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
