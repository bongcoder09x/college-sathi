"use client";

import PortalShell, { parentNav } from "@/components/PortalShell";
import { children, parent } from "@/lib/portals";
import { useStaffStore } from "@/lib/staffStore";
import PrintButton from "@/components/PrintButton";

export default function ParentResultsPage() {
  const store = useStaffStore();
  const child = children.find((c) => c.id === store.child) || children[0];
  const max = Math.max(...child.terms.map((t) => t.value)) + 1;

  return (
    <PortalShell
      title="Results & progress"
      subtitle={`${child.name} · ${child.semester}`}
      groups={parentNav}
      person={{ name: parent.name, sub: "Parent · 2 wards" }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Term comparison</p>
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate-400">CGPA trend</span>
            </div>
            <div className="mt-4 flex h-44 items-end gap-6">
              {child.terms.map((t) => (
                <div key={t.term} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11.5px] font-semibold text-ink">{t.value}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-700 to-brand-500"
                    style={{ height: `${(t.value / max) * 100}%` }}
                  />
                  <span className="text-[10.5px] text-slate-500">{t.term}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Semester 5 figure is the internal assessment average, not the final SGPA.</p>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-beige px-5 py-3">
              <p className="font-display text-lg">Latest marks</p>
            </div>
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-2 py-2">Assessment</th>
                  <th className="px-4 py-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/60">
                {child.latestMarks.map((m) => (
                  <tr key={m.subject}>
                    <td className="px-4 py-2.5 font-medium text-ink">{m.subject}</td>
                    <td className="px-2 py-2.5 text-slate-600">{m.type}</td>
                    <td className="px-4 py-2.5 text-right font-semibold">{m.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Progress report</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600">
              A consolidated report with attendance, internal marks and mentor remarks for the term.
            </p>
            <div className="mt-3 space-y-1.5 text-[11.5px] text-slate-600">
              <p>Mentor remark: “Steady improvement; revise ensembles and parsing before the end-semester.”</p>
              <p>Attendance: {child.attendance}%</p>
            </div>
            <PrintButton label="Download report" />
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Compare wards</p>
            <ul className="mt-2 space-y-2">
              {children.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-[11.5px]">
                  <span className="text-slate-600">{c.name.split(" ")[0]} · {c.campus.replace(" Campus", "")}</span>
                  <span className="font-semibold text-ink">{c.terms[c.terms.length - 1].value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
