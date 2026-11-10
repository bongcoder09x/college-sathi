"use client";

import { useState } from "react";
import PortalShell, { facultyNav } from "@/components/PortalShell";
import { faculty, mentees } from "@/lib/portals";

export default function MenteesPage() {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  return (
    <PortalShell
      title="Mentees"
      subtitle="10 mentees · attendance alerts and notes"
      groups={facultyNav}
      person={{ name: faculty.name, sub: `${faculty.code} · Faculty` }}
    >
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-beige px-4 py-3">
          <p className="font-display text-lg">Mentee list</p>
          <span className="badge-red">{mentees.filter((m) => m.alert).length} alerts</span>
        </div>
        <table className="w-full text-left text-[12.5px]">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Roll</th>
              <th className="px-2 py-2">Student</th>
              <th className="px-2 py-2">Attendance</th>
              <th className="px-2 py-2">CGPA</th>
              <th className="px-2 py-2">Note</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/60">
            {mentees.map((m) => (
              <tr key={m.roll} className={m.alert ? "bg-brand-50/40" : ""}>
                <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{m.roll}</td>
                <td className="px-2 py-2.5 font-medium text-ink">{m.name}</td>
                <td className="px-2 py-2.5">
                  <span className={m.alert ? "font-semibold text-brand-700" : "text-slate-600"}>{m.attendance}%</span>
                </td>
                <td className="px-2 py-2.5 text-slate-600">{m.cgpa}</td>
                <td className="px-2 py-2.5">
                  <input
                    className="input h-8 py-1"
                    placeholder="Add a note"
                    value={notes[m.roll] || ""}
                    onChange={(e) => setNotes({ ...notes, [m.roll]: e.target.value })}
                  />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => setMsg(`Alert queued for ${m.name}'s guardian.`)}
                    className="text-[11px] font-semibold text-brand-700 hover:underline"
                  >
                    Alert guardian
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-beige px-4 py-3 text-[11px] text-slate-500">
          {msg || "Alerts go to the guardian mobile on record and are copied to the mentor log."}
        </p>
      </div>
    </PortalShell>
  );
}
