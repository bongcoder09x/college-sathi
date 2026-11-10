"use client";

import { useState } from "react";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { hostel } from "@/lib/portal";
import { addComplaint, addOutpass, usePortalStore } from "@/lib/portalStore";

export default function HostelPage() {
  const store = usePortalStore();
  const [pass, setPass] = useState({ reason: "", from: "", to: "" });
  const [complaint, setComplaint] = useState({ subject: "", body: "" });
  const [msg, setMsg] = useState("");

  return (
    <PortalShell title="Hostel" subtitle={`Block ${hostel.block} · Room ${hostel.room}`} groups={studentNav}>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">Room {hostel.room}</p>
                <p className="text-[11.5px] text-slate-500">{hostel.bed} · Block {hostel.block}</p>
                <p className="mt-1 text-[11.5px] text-slate-600">Roommates: {hostel.roommates.join(", ")}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Warden: {hostel.warden}</p>
              </div>
              <span className="badge-green">Allotted</span>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-beige px-5 py-3">
              <p className="font-display text-lg">Mess menu this week</p>
            </div>
            <table className="w-full text-left text-[11.5px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Day</th>
                  <th className="px-3 py-2">Breakfast</th>
                  <th className="px-3 py-2">Lunch</th>
                  <th className="px-3 py-2">Dinner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/60">
                {hostel.mess.map((m) => (
                  <tr key={m.day}>
                    <td className="px-3 py-2 font-semibold text-ink">{m.day}</td>
                    <td className="px-3 py-2 text-slate-600">{m.breakfast}</td>
                    <td className="px-3 py-2 text-slate-600">{m.lunch}</td>
                    <td className="px-3 py-2 text-slate-600">{m.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Outpass request</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!pass.reason || !pass.from) return setMsg("Add a reason and departure time.");
                addOutpass(pass.reason, pass.from, pass.to || pass.from);
                setPass({ reason: "", from: "", to: "" });
                setMsg("Outpass request sent to the warden.");
              }}
              className="mt-3 space-y-2"
            >
              <input className="input" placeholder="Reason" value={pass.reason} onChange={(e) => setPass({ ...pass, reason: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="input" type="datetime-local" value={pass.from} onChange={(e) => setPass({ ...pass, from: e.target.value })} />
                <input className="input" type="datetime-local" value={pass.to} onChange={(e) => setPass({ ...pass, to: e.target.value })} />
              </div>
              <button className="btn-primary btn-sm w-full">Request outpass</button>
              {msg ? <p className="text-[11px] text-brand-700">{msg}</p> : null}
            </form>
            <ul className="mt-3 space-y-1.5 border-t border-beige pt-3">
              {store.outpasses.slice(0, 3).map((o) => (
                <li key={o.id} className="flex items-center justify-between text-[11.5px]">
                  <span className="truncate text-slate-600">{o.reason}</span>
                  <span className={o.status === "Approved" ? "badge-green" : "badge-amber"}>{o.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Complaint</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!complaint.subject) return;
                addComplaint(complaint.subject, "Hostel", complaint.body);
                setComplaint({ subject: "", body: "" });
                setMsg("Complaint logged — the warden's office will respond in 48 hours.");
              }}
              className="mt-3 space-y-2"
            >
              <input className="input" placeholder="Subject (e.g. water purifier)" value={complaint.subject} onChange={(e) => setComplaint({ ...complaint, subject: e.target.value })} />
              <textarea rows={2} className="input resize-none" placeholder="Details" value={complaint.body} onChange={(e) => setComplaint({ ...complaint, body: e.target.value })} />
              <button className="btn-outline btn-sm w-full">Submit complaint</button>
            </form>
            <ul className="mt-3 space-y-1.5 border-t border-beige pt-3">
              {store.complaints.slice(0, 3).map((c) => (
                <li key={c.id} className="flex items-center justify-between text-[11.5px]">
                  <span className="truncate text-slate-600">{c.subject}</span>
                  <span className="badge-amber shrink-0">{c.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
