"use client";

import PortalShell, { parentNav } from "@/components/PortalShell";
import { children, parent } from "@/lib/portals";
import { attendance, attendancePercent } from "@/lib/portal";
import { decideOutpass, useStaffStore } from "@/lib/staffStore";

export default function ParentAttendancePage() {
  const store = useStaffStore();
  const child = children.find((c) => c.id === store.child) || children[0];
  const outpasses = store.outpasses.filter((o) => o.child === child.id);

  return (
    <PortalShell
      title="Attendance & approvals"
      subtitle={`${child.name} · ${child.attendanceToday}`}
      groups={parentNav}
      person={{ name: parent.name, sub: "Parent · 2 wards" }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Subject-wise attendance</p>
            <div className="mt-3 space-y-3">
              {attendance.map((a) => {
                const p = attendancePercent(a.held, a.attended);
                return (
                  <div key={a.code}>
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="font-medium text-ink">{a.subject}</span>
                      <span className={p < 75 ? "font-semibold text-brand-700" : "text-slate-500"}>{p}% · {a.attended}/{a.held}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige/70">
                      <div className={`h-full rounded-full ${p < 75 ? "bg-brand-600" : "bg-accent-500"}`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-[11.5px] text-brand-800">
              Information Security and Lab: Networks are below the 75% requirement. A condonation request has been raised by the student.
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-beige px-5 py-3">
              <p className="font-display text-lg">Hostel outpass requests</p>
            </div>
            <ul className="divide-y divide-beige/60">
              {outpasses.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">{o.reason}</p>
                    <p className="text-[10.5px] text-slate-500">{o.id} · {o.when}</p>
                  </div>
                  {o.status === "Pending" ? (
                    <div className="flex gap-2">
                      <button onClick={() => decideOutpass(o.id, "Approved")} className="btn-primary btn-sm">Approve</button>
                      <button onClick={() => decideOutpass(o.id, "Rejected")} className="btn-outline btn-sm">Reject</button>
                    </div>
                  ) : (
                    <span className={o.status === "Approved" ? "badge-green" : "badge-red"}>{o.status}</span>
                  )}
                </li>
              ))}
              {outpasses.length === 0 ? <li className="px-5 py-6 text-[12px] text-slate-500">No outpass requests for this ward.</li> : null}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Today</p>
            <ul className="mt-3 space-y-2 text-[12px]">
              {[
                ["First period", "Present · 09:00"],
                ["Second period", "Present · 10:15"],
                ["Third period", "Present · 11:30"],
                ["Lab", "Not yet"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between rounded-xl bg-ivory/60 px-3 py-2">
                  <span className="text-slate-600">{k}</span>
                  <span className="font-semibold text-ink">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <p className="font-display text-lg">Leave history</p>
            <ul className="mt-2 space-y-1.5 text-[11.5px]">
              {[
                ["12–13 Sep", "Medical leave", "Approved"],
                ["21 Oct", "Condonation", "Pending"],
              ].map(([d, t, s]) => (
                <li key={d} className="flex items-center justify-between">
                  <span className="text-slate-600">{d} · {t}</span>
                  <span className={s === "Approved" ? "badge-green" : "badge-amber"}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
