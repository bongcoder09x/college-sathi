"use client";

import Link from "next/link";
import PortalShell, { facultyNav } from "@/components/PortalShell";
import { faculty, facultyCourses, facultyLectures, mentees } from "@/lib/portals";
import { useStaffStore } from "@/lib/staffStore";

export default function FacultyDashboard() {
  const store = useStaffStore();
  const pendingAttendance = facultyLectures.filter((l) => l.attendance === "pending").length;
  const pendingGrading = facultyCourses.reduce((s, c) => s + c.pendingGrading, 0);
  const alerts = mentees.filter((m) => m.alert).length;

  return (
    <PortalShell
      title={`Good morning, ${faculty.name.replace("Dr. ", "Dr ")}`}
      subtitle={`${faculty.designation} · ${faculty.department} · ${faculty.campus}`}
      groups={facultyNav}
      person={{ name: faculty.name, sub: `${faculty.code} · Faculty` }}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Today's lectures", value: String(facultyLectures.length), note: "first at 09:00 · CS-204" },
          { label: "Attendance pending", value: String(pendingAttendance), note: "mark before 6 PM" },
          { label: "Grading queue", value: String(pendingGrading), note: "assignments + quiz sheets" },
          { label: "Mentee alerts", value: String(alerts), note: "attendance below 75%" },
        ].map((k) => (
          <div key={k.label} className="kpi">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{k.label}</p>
            <p className="mt-1 font-display text-2xl text-ink">{k.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Today's schedule</p>
              <Link href="/faculty/attendance" className="text-[11.5px] font-semibold text-brand-700 hover:underline">Start a session</Link>
            </div>
            <ul className="mt-3 space-y-2">
              {facultyLectures.map((l) => (
                <li key={l.time + l.section} className="flex items-center gap-3 rounded-xl border border-beige/70 bg-ivory/50 p-3">
                  <span className="w-12 shrink-0 text-[11.5px] font-semibold text-slate-500">{l.time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{l.subject}</p>
                    <p className="truncate text-[11px] text-slate-500">{l.section} · {l.room}</p>
                  </div>
                  <span className={l.attendance === "pending" ? "badge-amber" : l.attendance === "marked" ? "badge-green" : "badge-slate"}>
                    {l.attendance === "pending" ? "attendance pending" : l.attendance}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">My courses</p>
            <ul className="mt-3 space-y-2">
              {facultyCourses.map((c) => (
                <li key={c.code} className="flex items-center justify-between gap-3 rounded-xl bg-ivory/60 px-3 py-2.5">
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">{c.title}</p>
                    <p className="text-[10.5px] text-slate-500">{c.code} · {c.sections.join(", ")}</p>
                  </div>
                  <span className="badge-amber">{c.pendingGrading} to grade</span>
                </li>
              ))}
            </ul>
            <Link href="/faculty/gradebook" className="btn-primary btn-sm mt-3 w-full">Open gradebook</Link>
          </div>
        </div>

        <div className="space-y-5">
          {store.attendanceSessions.length ? (
            <div className="card border-accent-500/40 p-5">
              <p className="font-display text-lg">Live session</p>
              {store.attendanceSessions.slice(0, 1).map((s) => (
                <div key={s.id}>
                  <p className="mt-1 text-[12px] text-slate-600">{s.subject} · {s.section} · {s.mode}</p>
                  <p className="mt-2 font-display text-3xl text-ink">{s.present}<span className="text-base text-slate-400"> present</span></p>
                  <p className="text-[11px] text-slate-500">{s.suspicious} flagged scan(s) · started {s.startedAt}</p>
                  <Link href="/faculty/attendance" className="btn-outline btn-sm mt-2">Open session</Link>
                </div>
              ))}
            </div>
          ) : null}

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Mentees needing attention</p>
              <Link href="/faculty/mentees" className="text-[11.5px] font-semibold text-brand-700 hover:underline">All</Link>
            </div>
            <ul className="mt-3 space-y-2">
              {mentees.filter((m) => m.alert).map((m) => (
                <li key={m.roll} className="flex items-center justify-between text-[12px]">
                  <span className="text-slate-700">{m.name}</span>
                  <span className="font-semibold text-brand-700">{m.attendance}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-brand-900 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-400">Pending action</p>
            <p className="mt-1 font-display text-xl">Internal marks for CSE501</p>
            <p className="text-[11.5px] text-brand-100">Lock and submit to the HoD before 12 December.</p>
            <Link href="/faculty/gradebook" className="btn-accent btn-sm mt-3">Open gradebook</Link>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
