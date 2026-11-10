"use client";

import Link from "next/link";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { attendance, attendancePercent, exams, fees, student, todayClasses } from "@/lib/portal";
import { notices } from "@/lib/data";
import { useSession } from "@/lib/session";
import { fmtDate, inr } from "@/lib/utils";

export default function StudentDashboard() {
  const { session } = useSession();
  const overall = attendancePercent(
    attendance.reduce((s, a) => s + a.held, 0),
    attendance.reduce((s, a) => s + a.attended, 0)
  );
  const shortage = attendance.filter((a) => attendancePercent(a.held, a.attended) < 75);

  return (
    <PortalShell
      title={`Hello, ${student.name.split(" ")[0]}`}
      subtitle={`${student.rollNo} · ${student.program} · ${student.campus} · ${student.semester}`}
      groups={studentNav}
      footer={
        <div className="card mt-3 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Mentor</p>
          <p className="mt-1 text-[12.5px] font-semibold text-ink">{student.mentor}</p>
          <p className="text-[11px] text-slate-500">Tue & Thu · 2–4 PM</p>
        </div>
      }
    >
      {!session ? (
        <div className="card mb-4 flex flex-wrap items-center justify-between gap-3 border-accent-500/40 p-4">
          <p className="text-[12.5px] text-slate-600">
            You are viewing the demo student. <strong className="text-ink">Sign in</strong> to see the role-aware
            dashboard (student, parent, staff or admin).
          </p>
          <Link href="/login" className="btn-primary btn-sm">Sign in</Link>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Attendance", value: `${overall}%`, note: shortage.length ? `${shortage.length} subject${shortage.length > 1 ? "s" : ""} below 75%` : "all subjects above 75%" },
          { label: "CGPA", value: student.cgpa, note: `${student.creditsEarned}/${student.creditsTotal} credits earned` },
          { label: "Fees due", value: inr(fees.due), note: "examination fee · due 25/11/2026" },
          { label: "Upcoming exams", value: String(exams.length), note: "first paper on 08/12/2026" },
        ].map((k) => (
          <div key={k.label} className="kpi">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{k.label}</p>
            <p className="mt-1 font-display text-2xl text-ink">{k.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Today's classes</p>
              <Link href="/student/timetable" className="text-[11.5px] font-semibold text-brand-700 hover:underline">Full timetable</Link>
            </div>
            <ul className="mt-3 space-y-2">
              {todayClasses.map((c) => (
                <li key={c.time} className="flex items-center gap-3 rounded-xl border border-beige/70 bg-ivory/50 p-3">
                  <span className="w-12 shrink-0 text-[11.5px] font-semibold text-slate-500">{c.time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{c.subject}</p>
                    <p className="truncate text-[11px] text-slate-500">{c.room} · {c.faculty}</p>
                  </div>
                  <span className={c.status === "live" ? "badge-green" : c.status === "done" ? "badge-slate" : "badge-amber"}>
                    {c.status === "live" ? "live now" : c.status === "done" ? "done" : "next"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Attendance watch</p>
              <Link href="/student/attendance" className="text-[11.5px] font-semibold text-brand-700 hover:underline">Details</Link>
            </div>
            <div className="mt-3 space-y-2.5">
              {attendance.slice(0, 4).map((a) => {
                const p = attendancePercent(a.held, a.attended);
                return (
                  <div key={a.code}>
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="font-medium text-ink">{a.subject}</span>
                      <span className={p < 75 ? "font-semibold text-brand-700" : "text-slate-500"}>{p}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige/70">
                      <div className={`h-full rounded-full ${p < 75 ? "bg-brand-600" : "bg-accent-500"}`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {shortage.length ? (
              <p className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-[11.5px] text-brand-800">
                Shortage in {shortage.map((s) => s.subject).join(", ")} — file a condonation request before the exam form closes.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Fee status</p>
              <Link href="/student/fees" className="text-[11.5px] font-semibold text-brand-700 hover:underline">Ledger</Link>
            </div>
            <p className="mt-2 font-display text-2xl text-ink">{inr(fees.due)}</p>
            <p className="text-[11.5px] text-slate-500">due on 25/11/2026 · examination fee</p>
            <Link href="/student/fees" className="btn-primary btn-sm mt-3 w-full">Pay now</Link>
            <ul className="mt-3 space-y-1.5 border-t border-beige pt-3">
              {fees.ledger.slice(0, 3).map((l) => (
                <li key={l.head} className="flex items-center justify-between text-[11.5px]">
                  <span className="truncate text-slate-600">{l.head}</span>
                  <span className="badge-green shrink-0">{l.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Notices</p>
              <Link href="/notices" className="text-[11.5px] font-semibold text-brand-700 hover:underline">All</Link>
            </div>
            <ul className="mt-3 space-y-2.5">
              {notices.slice(0, 4).map((n) => (
                <li key={n.id}>
                  <Link href="/notices" className="text-[12.5px] font-medium leading-snug text-slate-700 hover:text-brand-700">
                    {n.title}
                  </Link>
                  <p className="text-[10.5px] text-slate-400">{fmtDate(n.date)} · {n.category}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-brand-900 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-400">Next exam</p>
            <p className="mt-1 font-display text-xl">{exams[0].subject}</p>
            <p className="text-[11.5px] text-brand-100">{fmtDate(exams[0].date)} · {exams[0].time}</p>
            <p className="text-[11.5px] text-brand-100">{exams[0].room} · seat {exams[0].seat}</p>
            <Link href="/student/exams" className="btn-accent btn-sm mt-3">Hall ticket & schedule</Link>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
