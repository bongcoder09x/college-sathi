"use client";

import { useState } from "react";
import PortalShell, { facultyNav } from "@/components/PortalShell";
import { faculty, staffLeaves } from "@/lib/portals";
import { applyStaffLeave, useStaffStore } from "@/lib/staffStore";
import { fmtDate } from "@/lib/utils";

export default function FacultyLeavePage() {
  const store = useStaffStore();
  const [form, setForm] = useState({ from: "", to: "", type: "Casual" });
  const [msg, setMsg] = useState("");
  const history = [...store.staffLeaves, ...staffLeaves.history];

  return (
    <PortalShell
      title="Leave"
      subtitle="Staff leave balance and applications"
      groups={facultyNav}
      person={{ name: faculty.name, sub: `${faculty.code} · Faculty` }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Casual", staffLeaves.balance.casual],
          ["Earned", staffLeaves.balance.earned],
          ["Medical", staffLeaves.balance.medical],
        ].map(([k, v]) => (
          <div key={String(k)} className="kpi">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{k} leave</p>
            <p className="mt-1 font-display text-2xl text-ink">{v} days</p>
            <p className="text-[11px] text-slate-500">balance this year</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        <div className="card p-5">
          <p className="font-display text-lg">Apply for leave</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.from) return setMsg("Pick a start date.");
              applyStaffLeave(form.from, form.to || form.from, form.type);
              setForm({ from: "", to: "", type: "Casual" });
              setMsg("Application submitted to the HoD.");
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
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {["Casual", "Earned", "Medical", "Duty"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <button className="btn-primary btn-sm w-full">Submit application</button>
            {msg ? <p className="text-[11px] text-brand-700">{msg}</p> : null}
          </form>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-beige px-4 py-3">
            <p className="font-display text-lg">History</p>
          </div>
          <table className="w-full text-left text-[12.5px]">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Ref</th>
                <th className="px-2 py-2">Dates</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-4 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {history.map((h) => (
                <tr key={h.id}>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{h.id}</td>
                  <td className="px-2 py-2.5 text-slate-600">{fmtDate(h.from)}{h.to !== h.from ? ` – ${fmtDate(h.to)}` : ""}</td>
                  <td className="px-2 py-2.5 text-slate-600">{h.type}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={h.status === "Approved" ? "badge-green" : "badge-amber"}>{h.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}
