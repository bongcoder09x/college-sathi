"use client";

import { useState } from "react";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { student } from "@/lib/portal";
import PrintButton from "@/components/PrintButton";

const tabs = ["Personal", "Academic", "Documents"] as const;

export default function ProfilePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Personal");

  return (
    <PortalShell title="Profile" subtitle="Personal details, academic record and documents" groups={studentNav}>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="card p-6">
          <div className="inline-flex rounded-full border border-beige bg-ivory/60 p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition ${tab === t ? "bg-brand-600 text-ivory" : "text-slate-600"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Personal" && (
            <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {[
                ["Full name", student.name],
                ["Roll number", student.rollNo],
                ["Date of birth", student.dob],
                ["Blood group", student.bloodGroup],
                ["Category", student.category],
                ["Email", student.email],
                ["Mobile", student.phone],
                ["Address", student.address],
                ["Guardian", student.guardian],
                ["Hostel", `Block ${student.hostelRoom}`],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-dashed border-beige/70 pb-2">
                  <dt className="text-[10.5px] uppercase tracking-[0.12em] text-slate-400">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === "Academic" && (
            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-sand/70 p-4">
                <p className="text-[12.5px] font-semibold text-ink">{student.program}</p>
                <p className="text-[11.5px] text-slate-600">{student.campus} · {student.semester} · Section {student.section}</p>
                <p className="mt-1 text-[11.5px] text-slate-600">CGPA {student.cgpa} · {student.creditsEarned} of {student.creditsTotal} credits</p>
              </div>
              <table className="w-full text-left text-[12.5px]">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Qualification</th>
                    <th className="px-3 py-2">Board / university</th>
                    <th className="px-3 py-2">Year</th>
                    <th className="px-3 py-2 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/60">
                  {[
                    ["Class 10", "WBBSE", "2023", "95.4%"],
                    ["Class 12", "WBCHSE", "2025", "92.0%"],
                    ["Semester 4 (CGPA)", "College Sathi", "2026", "8.62 SGPA"],
                  ].map((r) => (
                    <tr key={r[0]}>
                      <td className="px-3 py-2 font-medium text-ink">{r[0]}</td>
                      <td className="px-3 py-2 text-slate-600">{r[1]}</td>
                      <td className="px-3 py-2 text-slate-600">{r[2]}</td>
                      <td className="px-3 py-2 text-right font-semibold">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Documents" && (
            <ul className="mt-5 space-y-2">
              {[
                ["Aadhaar (masked)", "Verified", "2026-07-05"],
                ["Class 10 marksheet", "Verified", "2026-07-05"],
                ["Class 12 marksheet", "Verified", "2026-07-05"],
                ["Caste certificate", "Not uploaded", "—"],
                ["Medical fitness form", "Pending review", "2026-11-02"],
              ].map(([name, status, at]) => (
                <li key={name} className="flex items-center justify-between gap-3 rounded-xl border border-beige/70 bg-ivory/50 px-3.5 py-2.5">
                  <div>
                    <p className="text-[12.5px] font-medium text-ink">{name}</p>
                    <p className="text-[10.5px] text-slate-500">Updated {at}</p>
                  </div>
                  <span className={status === "Verified" ? "badge-green" : status === "Pending review" ? "badge-amber" : "badge-slate"}>{status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-brand-700 to-brand-900 p-4 text-white">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-accent-300">Student identity card</p>
              <p className="mt-2 font-display text-lg leading-tight">{student.name}</p>
              <p className="text-[11px] text-brand-100">{student.rollNo} · {student.semester}</p>
            </div>
            <div className="p-4">
              <p className="text-[11px] text-slate-500">{student.program}</p>
              <p className="mt-1 text-[11px] text-slate-500">{student.campus}</p>
              <p className="mt-2 font-mono text-[11px] text-ink">{student.idCardNo}</p>
              <div className="mt-3 grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span key={i} className={`h-2 w-full ${[0, 1, 2, 4, 5, 8, 10, 12, 14, 16, 19, 20, 22, 24].includes(i) ? "bg-ink" : "bg-transparent"}`} />
                ))}
              </div>
              <PrintButton label="Download ID card" />
            </div>
          </div>
          <div className="card p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Need a change?</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600">
              Name or category corrections need a written request with supporting documents — raise it from the helpdesk.
            </p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
