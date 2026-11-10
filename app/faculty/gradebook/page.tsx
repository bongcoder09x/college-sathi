"use client";

import { useMemo, useState } from "react";
import PortalShell, { facultyNav } from "@/components/PortalShell";
import { faculty, gradebookStudents } from "@/lib/portals";
import { lockGradebook, saveGradebook, useStaffStore } from "@/lib/staffStore";

type Row = { roll: string; name: string; ct1: number; ct2: number; assignment: number; lab: number };

export default function GradebookPage() {
  const store = useStaffStore();
  const [rows, setRows] = useState<Row[]>(gradebookStudents as Row[]);
  const [imported, setImported] = useState<string | null>(null);
  const locked = store.gradebookLocked;

  const total = (r: Row) => Math.round(((r.ct1 + r.ct2 + r.assignment + r.lab) / 80) * 100);

  const stats = useMemo(() => {
    const values = rows.map(total);
    return {
      avg: Math.round(values.reduce((s, v) => s + v, 0) / values.length),
      high: Math.max(...values),
      low: Math.min(...values),
    };
  }, [rows]);

  const update = (roll: string, key: keyof Row, value: string) => {
    const num = Math.max(0, Math.min(20, Number(value) || 0));
    setRows((r) => r.map((row) => (row.roll === roll ? { ...row, [key]: num } : row)));
  };

  const importCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter((l) => l.includes(","));
      const parsed: Row[] = lines
        .slice(1)
        .map((l) => l.split(",").map((x) => x.trim()))
        .filter((c) => c.length >= 6)
        .map((c) => ({ roll: c[0], name: c[1], ct1: Number(c[2]) || 0, ct2: Number(c[3]) || 0, assignment: Number(c[4]) || 0, lab: Number(c[5]) || 0 }));
      if (parsed.length) {
        setRows(parsed);
        setImported(`${parsed.length} rows imported from ${file.name}`);
      } else {
        setImported("Could not read that CSV — expected roll,name,ct1,ct2,assignment,lab");
      }
    };
    reader.readAsText(file);
  };

  return (
    <PortalShell
      title="Gradebook"
      subtitle="CSE501 · Machine Learning · internal marks (20 each)"
      groups={facultyNav}
      person={{ name: faculty.name, sub: `${faculty.code} · Faculty` }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Class average", `${stats.avg}%`],
          ["Highest", `${stats.high}%`],
          ["Lowest", `${stats.low}%`],
        ].map(([k, v]) => (
          <div key={k} className="kpi">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{k}</p>
            <p className="mt-1 font-display text-2xl text-ink">{v}</p>
          </div>
        ))}
      </div>

      <div className="card mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-beige px-4 py-3">
          <p className="font-display text-lg">Internal marks grid</p>
          <div className="flex flex-wrap gap-2">
            <label className="btn-outline btn-sm cursor-pointer">
              Import CSV
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
            </label>
            <button onClick={() => saveGradebook(rows)} className="btn-outline btn-sm">Save draft</button>
            <button onClick={lockGradebook} disabled={locked} className="btn-primary btn-sm">
              {locked ? "Locked & submitted" : "Lock & submit to HoD"}
            </button>
          </div>
        </div>

        {imported ? <p className="border-b border-beige bg-brand-50/50 px-4 py-2 text-[11.5px] text-brand-800">{imported}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-[12.5px]">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Roll</th>
                <th className="px-2 py-2">Student</th>
                <th className="px-2 py-2">CT 1</th>
                <th className="px-2 py-2">CT 2</th>
                <th className="px-2 py-2">Assignment</th>
                <th className="px-2 py-2">Lab</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {rows.map((r) => (
                <tr key={r.roll}>
                  <td className="px-4 py-2 font-mono text-[11px] text-slate-500">{r.roll}</td>
                  <td className="px-2 py-2 font-medium text-ink">{r.name}</td>
                  {(["ct1", "ct2", "assignment", "lab"] as const).map((k) => (
                    <td key={k} className="px-2 py-2">
                      <input
                        className="input h-8 w-16 px-2 py-1 text-center"
                        value={r[k]}
                        disabled={locked}
                        onChange={(e) => update(r.roll, k, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right font-semibold">{total(r)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-beige px-4 py-3 text-[11px] text-slate-500">
          CSV format: <span className="font-mono">roll,name,ct1,ct2,assignment,lab</span> · maximum 20 per component.
        </p>
      </div>
    </PortalShell>
  );
}
