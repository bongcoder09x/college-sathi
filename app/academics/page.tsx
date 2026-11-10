"use client";

import Link from "next/link";
import PortalShell, { academicsNav } from "@/components/PortalShell";
import { department } from "@/lib/portals";
import { useStaffStore } from "@/lib/staffStore";

export default function AcademicsDashboard() {
  const store = useStaffStore();
  const avgCoverage = Math.round(department.syllabus.reduce((s, x) => s + x.coverage, 0) / department.syllabus.length);

  return (
    <PortalShell
      title="Department dashboard"
      subtitle={`${department.name} · HOD ${department.hod}`}
      groups={academicsNav}
      person={{ name: department.hod, sub: "HOD · Computer Science" }}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Faculty", value: String(department.faculty), note: "5 with load above 18 h" },
          { label: "Students", value: String(department.students), note: `${department.programmes} programmes` },
          { label: "Syllabus coverage", value: `${avgCoverage}%`, note: "mid-semester average" },
          { label: "Attendance", value: `${department.attendanceTrend[department.attendanceTrend.length - 1].value}%`, note: "latest week" },
        ].map((k) => (
          <div key={k.label} className="kpi">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{k.label}</p>
            <p className="mt-1 font-display text-2xl text-ink">{k.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Attendance trend</p>
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate-400">last 6 weeks</span>
            </div>
            <div className="mt-4 flex h-36 items-end gap-3">
              {department.attendanceTrend.map((t) => (
                <div key={t.week} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10.5px] font-semibold text-ink">{t.value}%</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-accent-600 to-accent-400" style={{ height: `${t.value}%` }} />
                  <span className="text-[10px] text-slate-500">{t.week}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-beige px-4 py-3">
              <p className="font-display text-lg">Syllabus coverage</p>
            </div>
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-2 py-2">Faculty</th>
                  <th className="px-4 py-2">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/60">
                {department.syllabus.map((s) => (
                  <tr key={s.code}>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-ink">{s.subject}</p>
                      <p className="text-[10px] text-slate-500">{s.code}</p>
                    </td>
                    <td className="px-2 py-2.5 text-slate-600">{s.faculty}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-beige/70">
                          <div className={`h-full rounded-full ${s.coverage < 55 ? "bg-brand-600" : "bg-accent-500"}`} style={{ width: `${s.coverage}%` }} />
                        </div>
                        <span className="text-[11px] font-semibold text-ink">{s.coverage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Faculty load</p>
            <ul className="mt-3 space-y-2.5">
              {department.facultyLoad.map((f) => (
                <li key={f.name}>
                  <div className="flex items-baseline justify-between text-[11.5px]">
                    <span className="font-medium text-ink">{f.name}</span>
                    <span className={f.hours >= f.max ? "font-semibold text-brand-700" : "text-slate-500"}>{f.hours}/{f.max} h</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige/70">
                    <div className={`h-full rounded-full ${f.hours >= f.max ? "bg-brand-600" : "bg-accent-500"}`} style={{ width: `${(f.hours / f.max) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Pending approvals</p>
            <ul className="mt-2 space-y-1.5 text-[11.5px]">
              <li className="flex items-center justify-between">
                <span className="text-slate-600">Internal marks</span>
                <span className="badge-amber">2 grids</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-600">Timetable draft</span>
                <span className="badge-slate">{store.builderVersion}</span>
              </li>
            </ul>
            <div className="mt-3 flex gap-2">
              <Link href="/academics/approvals" className="btn-primary btn-sm flex-1">Review marks</Link>
              <Link href="/academics/timetable" className="btn-outline btn-sm flex-1">Timetable</Link>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
