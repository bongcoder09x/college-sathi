"use client";

import { useState } from "react";
import PortalShell, { academicsNav } from "@/components/PortalShell";
import { allocations, department } from "@/lib/portals";

export default function AllocationPage() {
  const [rows, setRows] = useState(allocations);
  const [msg, setMsg] = useState("");

  return (
    <PortalShell
      title="Subject allocation"
      subtitle="Faculty ↔ subject ↔ section mapping for Semester 5"
      groups={academicsNav}
      person={{ name: department.hod, sub: "HOD · Computer Science" }}
    >
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-beige px-4 py-3">
          <p className="font-display text-lg">Allocation grid</p>
          <button onClick={() => setMsg("Allocation saved and synced to faculty timetables.")} className="btn-primary btn-sm">Save allocation</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Code</th>
                <th className="px-2 py-2">Subject</th>
                <th className="px-2 py-2">Faculty</th>
                <th className="px-2 py-2">Section</th>
                <th className="px-4 py-2 text-right">Hours / week</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {rows.map((r, i) => (
                <tr key={`${r.code}-${r.section}`}>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{r.code}</td>
                  <td className="px-2 py-2.5 font-medium text-ink">{r.subject}</td>
                  <td className="px-2 py-2.5">
                    <select
                      className="input h-8 py-1"
                      value={r.faculty}
                      onChange={(e) => setRows((rs) => rs.map((x, xi) => (xi === i ? { ...x, faculty: e.target.value } : x)))}
                    >
                      {department.facultyLoad.map((f) => (
                        <option key={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2.5 text-slate-600">{r.section}</td>
                  <td className="px-4 py-2.5 text-right">
                    <input
                      className="input h-8 w-16 px-2 py-1 text-center"
                      value={r.hours}
                      onChange={(e) => setRows((rs) => rs.map((x, xi) => (xi === i ? { ...x, hours: Number(e.target.value) || 0 } : x)))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-beige px-4 py-3 text-[11px] text-slate-500">
          {msg || "Total weekly hours per faculty are validated against the department cap of 20."}
        </p>
      </div>
    </PortalShell>
  );
}
