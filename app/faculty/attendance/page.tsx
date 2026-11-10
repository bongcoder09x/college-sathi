"use client";

import { useEffect, useState } from "react";
import PortalShell, { facultyNav } from "@/components/PortalShell";
import { faculty, facultyLectures, sections } from "@/lib/portals";
import { closeSession, startSession, tickSession, useStaffStore } from "@/lib/staffStore";

const modes = [
  { id: "manual", label: "Manual roll", note: "Call names, tick the list" },
  { id: "rotating-qr", label: "Rotating QR", note: "New code every 20 seconds" },
  { id: "geofence", label: "QR + geofence", note: "Only inside the classroom radius" },
];

export default function FacultyAttendancePage() {
  const store = useStaffStore();
  const [section, setSection] = useState("CSE-5A");
  const [subject, setSubject] = useState("Machine Learning");
  const [mode, setMode] = useState("rotating-qr");
  const [code, setCode] = useState("481 902");

  const live = store.attendanceSessions.find((s) => s.open);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      tickSession(live.id);
      setCode(String(Math.floor(100000 + Math.random() * 899999)).replace(/(\d{3})(\d{3})/, "$1 $2"));
    }, 2200);
    return () => clearInterval(t);
  }, [live?.id]);

  return (
    <PortalShell
      title="Attendance"
      subtitle="Start a session, watch the counter, edit within 24 hours"
      groups={facultyNav}
      person={{ name: faculty.name, sub: `${faculty.code} · Faculty` }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Start a session</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <label className="label">Section</label>
                <select className="input" value={section} onChange={(e) => setSection(e.target.value)}>
                  {sections.map((s) => (
                    <option key={s.id}>{s.id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Subject</label>
                <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  {facultyLectures.filter((l) => l.subject !== "Mentoring hour").map((l) => (
                    <option key={l.subject}>{l.subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="label mt-3">Mode</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    mode === m.id ? "border-brand-500 bg-brand-50" : "border-beige bg-ivory/60 hover:border-accent-500/60"
                  }`}
                >
                  <p className="text-[12px] font-semibold text-ink">{m.label}</p>
                  <p className="text-[10px] text-slate-500">{m.note}</p>
                </button>
              ))}
            </div>

            {live ? (
              <div className="mt-4 rounded-xl border border-accent-500/40 bg-accent-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">{live.subject} · {live.section}</p>
                    <p className="text-[10.5px] text-slate-500">Started {live.startedAt} · {live.mode}</p>
                  </div>
                  <span className="badge-green">live</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-ivory/80 px-2 py-2">
                    <p className="font-display text-2xl text-ink">{live.present}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">present</p>
                  </div>
                  <div className="rounded-xl bg-ivory/80 px-2 py-2">
                    <p className="font-display text-2xl text-ink">{Math.max(0, 58 - live.present)}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">pending</p>
                  </div>
                  <div className="rounded-xl bg-ivory/80 px-2 py-2">
                    <p className="font-display text-2xl text-brand-700">{live.suspicious}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">flagged</p>
                  </div>
                </div>
                {mode !== "manual" ? (
                  <div className="mt-3 rounded-xl bg-ivory/80 px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Rotating code</p>
                    <p className="font-mono text-xl tracking-[0.3em] text-ink">{code}</p>
                  </div>
                ) : null}
                <button onClick={() => closeSession(live.id)} className="btn-outline btn-sm mt-3 w-full">End session & save</button>
              </div>
            ) : (
              <button
                onClick={() => startSession(section, subject, modes.find((m) => m.id === mode)?.label || mode)}
                className="btn-primary mt-4 w-full"
              >
                Start attendance
              </button>
            )}
            <p className="mt-2 text-[10.5px] text-slate-500">
              Live counter streams over a socket in production; this demo simulates scans every couple of seconds.
            </p>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Edit window (24 h)</p>
            <p className="mt-1 text-[11.5px] text-slate-600">
              Sessions can be corrected for 24 hours after they close. Every edit is logged with your faculty code.
            </p>
            <ul className="mt-3 space-y-2">
              {facultyLectures.filter((l) => l.attendance === "marked").map((l) => (
                <li key={l.time} className="flex items-center justify-between rounded-xl bg-ivory/60 px-3 py-2 text-[11.5px]">
                  <span className="text-slate-600">{l.subject} · {l.section}</span>
                  <button className="font-semibold text-brand-700 hover:underline">Edit</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Section history</p>
            <ul className="mt-3 space-y-2">
              {sections.map((s) => (
                <li key={s.id} className="rounded-xl border border-beige/70 bg-ivory/50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold text-ink">{s.id}</p>
                    <span className="badge-slate">{s.students} students</span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-slate-500">{s.sessions} sessions · avg attendance {s.avgAttendance}%</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Session log</p>
            <ul className="mt-2 space-y-1.5 text-[11.5px]">
              {store.attendanceSessions.length === 0 ? <li className="text-slate-500">No sessions started in this browser yet.</li> : null}
              {store.attendanceSessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between">
                  <span className="truncate text-slate-600">{s.subject} · {s.section}</span>
                  <span className={s.open ? "badge-green" : "badge-slate"}>{s.open ? "live" : `${s.present} present`}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
