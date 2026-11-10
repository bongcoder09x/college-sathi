"use client";

import PortalShell, { academicsNav } from "@/components/PortalShell";
import { department, shortageList } from "@/lib/portals";
import { notifyParents, useStaffStore } from "@/lib/staffStore";

export default function ShortagePage() {
  const store = useStaffStore();

  const exportCsv = () => {
    const rows = [["roll", "name", "section", "attendance", "guardian"], ...shortageList.map((s) => [s.roll, s.name, s.section, String(s.attendance), s.guardian])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-shortage.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PortalShell
      title="Attendance shortage"
      subtitle="Students below the 75% requirement"
      groups={academicsNav}
      person={{ name: department.hod, sub: "HOD · Computer Science" }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Students short", String(shortageList.length)],
          ["Lowest", `${Math.min(...shortageList.map((s) => s.attendance))}%`],
          ["Sections affected", String(new Set(shortageList.map((s) => s.section)).size)],
        ].map(([k, v]) => (
          <div key={k} className="kpi">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{k}</p>
            <p className="mt-1 font-display text-2xl text-ink">{v}</p>
          </div>
        ))}
      </div>

      <div className="card mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-beige px-4 py-3">
          <p className="font-display text-lg">Shortage list</p>
          <div className="flex gap-2">
            <button onClick={exportCsv} className="btn-outline btn-sm">Export CSV</button>
            <button onClick={() => notifyParents(shortageList.map((s) => s.name))} className="btn-primary btn-sm">Notify parents</button>
          </div>
        </div>
        <table className="w-full text-left text-[12.5px]">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Roll</th>
              <th className="px-2 py-2">Student</th>
              <th className="px-2 py-2">Section</th>
              <th className="px-2 py-2">Attendance</th>
              <th className="px-4 py-2 text-right">Guardian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/60">
            {shortageList.map((s) => (
              <tr key={s.roll}>
                <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{s.roll}</td>
                <td className="px-2 py-2.5 font-medium text-ink">{s.name}</td>
                <td className="px-2 py-2.5 text-slate-600">{s.section}</td>
                <td className="px-2 py-2.5 font-semibold text-brand-700">{s.attendance}%</td>
                <td className="px-4 py-2.5 text-right text-slate-600">{s.guardian}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-beige px-4 py-3 text-[11px] text-slate-500">
          {store.notifications[0] || "Notifications are sent as SMS to the guardian number on record."}
        </p>
      </div>
    </PortalShell>
  );
}
