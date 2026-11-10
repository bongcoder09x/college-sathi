"use client";

import PortalShell, { studentNav } from "@/components/PortalShell";
import { examResults, exams } from "@/lib/portal";
import { requestRevaluation, usePortalStore } from "@/lib/portalStore";
import { fmtDate } from "@/lib/utils";
import PrintButton from "@/components/PrintButton";

export default function ExamsPage() {
  const store = usePortalStore();
  const sgpa = "8.62";

  return (
    <PortalShell title="Exams & results" subtitle="End-semester schedule, seat allocation and results" groups={studentNav}>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-beige px-5 py-3">
              <p className="font-display text-lg">End-semester schedule</p>
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate-400">Dec 2026</span>
            </div>
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2">Paper</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Room</th>
                  <th className="px-2 py-2">Seat</th>
                  <th className="px-4 py-2">Hall ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/60">
                {exams.map((e) => (
                  <tr key={e.code}>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-ink">{e.subject}</p>
                      <p className="text-[10px] text-slate-500">{e.code} · {e.time}</p>
                    </td>
                    <td className="px-2 py-2.5 text-slate-600">{fmtDate(e.date)}</td>
                    <td className="px-2 py-2.5 text-slate-600">{e.room}</td>
                    <td className="px-2 py-2.5 font-semibold text-ink">{e.seat}</td>
                    <td className="px-4 py-2.5">
                      {e.hallTicket ? <span className="badge-green">Ready</span> : <span className="badge-amber">After fee</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Semester 4 result</p>
              <span className="badge-green">SGPA {sgpa}</span>
            </div>
            <table className="mt-3 w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Paper</th>
                  <th className="px-2 py-2">Credits</th>
                  <th className="px-2 py-2">Grade</th>
                  <th className="px-2 py-2">Points</th>
                  <th className="px-3 py-2 text-right">Revaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/60">
                {examResults.map((r) => {
                  const req = store.revaluations.find((x) => x.code === r.code);
                  return (
                    <tr key={r.code}>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-ink">{r.subject}</p>
                        <p className="text-[10px] text-slate-500">{r.code}</p>
                      </td>
                      <td className="px-2 py-2.5 text-slate-600">{r.credits}</td>
                      <td className="px-2 py-2.5"><span className="badge-green">{r.grade}</span></td>
                      <td className="px-2 py-2.5 font-semibold">{r.points}</td>
                      <td className="px-3 py-2.5 text-right">
                        {req ? (
                          <span className="badge-amber">{req.status}</span>
                        ) : (
                          <button onClick={() => requestRevaluation(r.code, r.subject)} className="text-[11px] font-semibold text-brand-700 hover:underline">
                            Request
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 text-[11px] text-slate-500">Revaluation fee ₹500 per paper · closes 18 November 2026.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Hall ticket</p>
            <p className="mt-1 text-[11.5px] text-slate-600">
              Seat A-14, Hall A. Carry a printed copy and your ID card.
            </p>
            <div className="mt-3 rounded-xl border border-beige bg-ivory/60 p-3">
              <p className="font-mono text-[11px] text-slate-600">CS-STU-2022-0417 · SEM5</p>
              <div className="mt-2 grid grid-cols-10 gap-0.5">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i} className={`h-2.5 ${[0, 1, 3, 4, 6, 9, 11, 13, 15, 17, 19, 20, 22, 25, 27, 29].includes(i) ? "bg-ink" : "bg-transparent"}`} />
                ))}
              </div>
            </div>
            <PrintButton label="Download hall ticket" />
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Exam guidelines</p>
            <ul className="mt-2 space-y-1.5 text-[11.5px] leading-relaxed text-slate-600">
              <li>• Report 30 minutes before the start time.</li>
              <li>• No phones, smart watches or calculators.</li>
              <li>• Use your seat number exactly as printed.</li>
              <li>• Medical absence needs a certificate within 3 days.</li>
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
