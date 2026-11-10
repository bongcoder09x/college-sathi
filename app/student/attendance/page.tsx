"use client";

import { useState } from "react";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { attendance, attendanceHeatmap, attendancePercent } from "@/lib/portal";
import { addLeave, usePortalStore } from "@/lib/portalStore";

export default function AttendancePage() {
  const store = usePortalStore();
  const [scanning, setScanning] = useState<"idle" | "asking" | "denied" | "done">("idle");
  const [manual, setManual] = useState("");
  const [form, setForm] = useState({ from: "", to: "", kind: "Leave", reason: "" });
  const [msg, setMsg] = useState("");

  const overall = attendancePercent(
    attendance.reduce((s, a) => s + a.held, 0),
    attendance.reduce((s, a) => s + a.attended, 0)
  );

  const startScan = async () => {
    setScanning("asking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.getTracks().forEach((t) => t.stop());
      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => {}, () => {});
      setScanning("done");
    } catch {
      setScanning("denied");
    }
  };

  return (
    <PortalShell title="Attendance" subtitle={`Overall ${overall}% · minimum requirement 75%`} groups={studentNav}>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="border-b border-beige px-5 py-3">
              <p className="font-display text-lg">Subject-wise attendance</p>
            </div>
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-2 py-2">Held</th>
                  <th className="px-2 py-2">Attended</th>
                  <th className="px-3 py-2">%</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/60">
                {attendance.map((a) => {
                  const p = attendancePercent(a.held, a.attended);
                  const short = p < 75;
                  return (
                    <tr key={a.code} className={short ? "bg-brand-50/40" : ""}>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-ink">{a.subject}</p>
                        <p className="text-[10px] text-slate-500">{a.code} · {a.faculty}</p>
                      </td>
                      <td className="px-2 py-2.5 text-slate-600">{a.held}</td>
                      <td className="px-2 py-2.5 text-slate-600">{a.attended}</td>
                      <td className="px-3 py-2.5 font-semibold">{p}%</td>
                      <td className="px-4 py-2.5">
                        <span className={short ? "badge-red" : "badge-green"}>{short ? "Shortage" : "OK"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="border-t border-beige px-4 py-3 text-[11px] text-slate-500">
              Condonation can be requested for medical or duty reasons before the examination form closes.
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Calendar heatmap</p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="h-2.5 w-2.5 rounded bg-beige" /> holiday
                <span className="ml-2 h-2.5 w-2.5 rounded bg-brand-200" /> absent
                <span className="ml-2 h-2.5 w-2.5 rounded bg-accent-500" /> present
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5 sm:grid-cols-12">
              {attendanceHeatmap.map((v, i) => (
                <span
                  key={i}
                  title={`Day ${i + 1}`}
                  className={`aspect-square rounded-[4px] ${v === 2 ? "bg-beige" : v === 1 ? "bg-accent-500" : "bg-brand-200"}`}
                />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">Last 12 weeks · each square is one teaching day.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Scan QR to mark attendance</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600">
              Open the class QR poster in the classroom. The camera and location permission are requested on this
              device only.
            </p>
            <div className="mt-3 grid place-items-center rounded-xl border-2 border-dashed border-beige bg-ivory/60 py-6">
              {scanning === "done" ? (
                <div className="text-center">
                  <span className="badge-green">Attendance marked</span>
                  <p className="mt-2 text-[11.5px] text-slate-600">Compiler Design · 10:15 AM · Main Campus</p>
                </div>
              ) : scanning === "denied" ? (
                <div className="px-4 text-center">
                  <p className="text-[12px] font-semibold text-ink">Camera unavailable</p>
                  <p className="mt-1 text-[11px] text-slate-500">Enter the 6-digit code shown on the classroom screen.</p>
                  <input className="input mt-2 text-center tracking-[0.3em]" maxLength={6} value={manual} onChange={(e) => setManual(e.target.value)} placeholder="••••••" />
                  <button onClick={() => setScanning("done")} className="btn-primary btn-sm mt-2">Submit code</button>
                </div>
              ) : (
                <div className="text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 mx-auto">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4M8 12h8" /></svg>
                  </span>
                  <button onClick={startScan} className="btn-primary btn-sm mt-3">
                    {scanning === "asking" ? "Opening camera…" : "Scan QR"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Leave / condonation</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.from || !form.reason) {
                  setMsg("Add the dates and a reason.");
                  return;
                }
                addLeave({ from: form.from, to: form.to || form.from, kind: form.kind as "Leave" | "Condonation", reason: form.reason });
                setForm({ from: "", to: "", kind: "Leave", reason: "" });
                setMsg("Request submitted to your mentor.");
              }}
              className="mt-3 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">From</label>
                  <input type="date" className="input" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
                </div>
                <div>
                  <label className="label">To</label>
                  <input type="date" className="input" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                  <option>Leave</option>
                  <option>Condonation</option>
                </select>
              </div>
              <div>
                <label className="label">Reason</label>
                <textarea rows={2} className="input resize-none" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              </div>
              <button className="btn-primary btn-sm w-full">Submit request</button>
              {msg ? <p className="text-[11px] text-brand-700">{msg}</p> : null}
            </form>

            <ul className="mt-3 space-y-1.5 border-t border-beige pt-3">
              {store.leaves.slice(0, 3).map((l) => (
                <li key={l.id} className="flex items-center justify-between text-[11.5px]">
                  <span className="truncate text-slate-600">{l.kind} · {l.from}</span>
                  <span className={l.status === "Approved" ? "badge-green" : l.status === "Pending" ? "badge-amber" : "badge-red"}>{l.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
