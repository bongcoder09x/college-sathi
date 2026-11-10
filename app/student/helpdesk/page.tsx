"use client";

import { useState } from "react";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { helpdeskTickets } from "@/lib/portal";
import { addTicket, requestCertificate, usePortalStore } from "@/lib/portalStore";

export default function HelpdeskPage() {
  const store = usePortalStore();
  const [form, setForm] = useState({ subject: "", category: "Certificates", body: "" });
  const [msg, setMsg] = useState("");

  const tickets = [...store.tickets, ...helpdeskTickets];

  return (
    <PortalShell title="Helpdesk" subtitle="Tickets, certificates and document requests" groups={studentNav}>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Raise a ticket</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.subject) return setMsg("Add a subject so we can route it.");
                const t = addTicket(form.subject, form.category, form.body);
                setForm({ subject: "", category: "Certificates", body: "" });
                setMsg(`Ticket ${t.id} created — expect a reply within one working day.`);
              }}
              className="mt-3 space-y-2"
            >
              <input className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Certificates", "Examination", "Fees", "Hostel", "Transport", "Library", "IT support"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <textarea rows={3} className="input resize-none" placeholder="Describe the issue" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              <button className="btn-primary btn-sm w-full">Submit ticket</button>
              {msg ? <p className="text-[11px] text-brand-700">{msg}</p> : null}
            </form>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-beige px-5 py-3">
              <p className="font-display text-lg">My tickets</p>
            </div>
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2">Ticket</th>
                  <th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">Updated</th>
                  <th className="px-4 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/60">
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-ink">{t.subject}</p>
                      <p className="text-[10px] text-slate-500">{t.id}</p>
                    </td>
                    <td className="px-2 py-2.5 text-slate-600">{t.category}</td>
                    <td className="px-2 py-2.5 text-slate-600">{t.updated}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={t.status === "Resolved" ? "badge-green" : t.status === "In progress" ? "badge-amber" : "badge-slate"}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Certificate requests</p>
            <ul className="mt-3 space-y-2">
              {store.certificates.map((c) => (
                <li key={c.type} className="rounded-xl border border-beige/70 bg-ivory/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold text-ink">{c.type}</p>
                    <span className={c.status === "Issued" ? "badge-green" : c.status === "In progress" ? "badge-amber" : "badge-slate"}>{c.status}</span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-slate-500">Raised {c.raised} · {c.eta}</p>
                  {c.status === "Not requested" ? (
                    <button onClick={() => requestCertificate(c.type)} className="mt-1.5 text-[11px] font-semibold text-brand-700 hover:underline">
                      Request now
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-brand-900 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-400">Urgent?</p>
            <p className="mt-1 font-display text-xl">Campus helpdesk</p>
            <p className="mt-1 text-[11.5px] text-brand-100">Ground floor, admin block · 9 AM – 6 PM</p>
            <p className="text-[11.5px] text-brand-100">1800 120 4455 · help@collegesathi.edu.in</p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
