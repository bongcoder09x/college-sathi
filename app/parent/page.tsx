"use client";

import Link from "next/link";
import PortalShell, { parentNav } from "@/components/PortalShell";
import { children, parent } from "@/lib/portals";
import { setChild, useStaffStore } from "@/lib/staffStore";
import { inr } from "@/lib/utils";

export default function ParentDashboard() {
  const store = useStaffStore();
  const child = children.find((c) => c.id === store.child) || children[0];
  const pending = store.outpasses.filter((o) => o.child === child.id && o.status === "Pending");

  return (
    <PortalShell
      title={`${child.name.split(" ")[0]}'s progress`}
      subtitle={`${child.rollNo} · ${child.program} · ${child.campus}`}
      groups={parentNav}
      person={{ name: parent.name, sub: "Parent · 2 wards" }}
      footer={
        <div className="card mt-3 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Class mentor</p>
          <p className="mt-1 text-[12.5px] font-semibold text-ink">Dr. A. Sengupta</p>
          <Link href="/parent/messages" className="btn-outline btn-sm mt-2 w-full">Message</Link>
        </div>
      }
    >
      {/* child switcher */}
      <div className="card mb-4 flex flex-wrap items-center gap-2 p-3">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">Viewing</span>
        {children.map((c) => (
          <button
            key={c.id}
            onClick={() => setChild(c.id)}
            className={`chip ${store.child === c.id ? "chip-active" : ""}`}
          >
            {c.name.split(" ")[0]} · {c.campus.replace(" Campus", "")}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Attendance", value: `${child.attendance}%`, note: child.attendanceToday },
          { label: "Latest marks", value: child.latestMarks[0].score, note: child.latestMarks[0].subject },
          { label: "Fee dues", value: inr(child.feeDue), note: child.feeDue ? "examination fee" : "nothing pending" },
          { label: "Bus ETA", value: child.busEta, note: `${child.busStop} stop` },
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
              <p className="font-display text-lg">Recent marks</p>
              <Link href="/parent/results" className="text-[11.5px] font-semibold text-brand-700 hover:underline">Progress report</Link>
            </div>
            <ul className="mt-3 divide-y divide-beige/60">
              {child.latestMarks.map((m) => (
                <li key={m.subject} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="text-[12.5px] font-medium text-ink">{m.subject}</p>
                    <p className="text-[10.5px] text-slate-500">{m.type}</p>
                  </div>
                  <span className="badge-green">{m.score}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">Approvals waiting</p>
              <Link href="/parent/attendance" className="text-[11.5px] font-semibold text-brand-700 hover:underline">Open</Link>
            </div>
            {pending.length === 0 ? (
              <p className="mt-3 text-[12px] text-slate-500">Nothing needs your approval right now.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pending.map((o) => (
                  <li key={o.id} className="rounded-xl border border-accent-500/40 bg-accent-50/60 p-3">
                    <p className="text-[12px] font-semibold text-ink">Hostel outpass · {o.id}</p>
                    <p className="text-[11px] text-slate-600">{o.reason} · {o.when}</p>
                    <Link href="/parent/attendance" className="btn-primary btn-sm mt-2">Review</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Fees</p>
            <p className="mt-2 font-display text-2xl text-ink">{inr(child.feeDue)}</p>
            <p className="text-[11.5px] text-slate-500">{child.feeDue ? "due 25/11/2026 · examination fee" : "All cleared for this semester"}</p>
            <Link href="/parent/fees" className="btn-primary btn-sm mt-3 w-full">Pay / view receipts</Link>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Bus now</p>
            <p className="mt-1 text-[12.5px] text-slate-600">Arriving at <strong className="text-ink">{child.busStop}</strong> in {child.busEta}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-beige/70">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-accent-400 to-brand-600" />
            </div>
            <Link href="/parent/transport" className="btn-outline btn-sm mt-3 w-full">Live tracking</Link>
          </div>

          <div className="card bg-brand-900 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-400">Parent-teacher meeting</p>
            <p className="mt-1 font-display text-xl">{store.ptm ? `Booked · ${store.ptm.slot}` : "Slots open 16–17 Nov"}</p>
            <Link href="/parent/ptm" className="btn-accent btn-sm mt-3">{store.ptm ? "View booking" : "Book a slot"}</Link>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
