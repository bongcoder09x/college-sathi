"use client";

import { useState } from "react";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { fees } from "@/lib/portal";
import { payFee, usePortalStore } from "@/lib/portalStore";
import { fmtDate, inr } from "@/lib/utils";

export default function FeesPage() {
  const store = usePortalStore();
  const [paid, setPaid] = useState<string | null>(null);
  const paidExtra = store.payments.reduce((s, p) => s + p.amount, 0);
  const due = Math.max(0, fees.due - paidExtra);

  const pay = (head: string, amount: number) => {
    const entry = payFee(head, amount, "UPI (demo)");
    setPaid(entry.receipt);
  };

  return (
    <PortalShell title="Fees" subtitle="Ledger, installments, scholarships and receipts" groups={studentNav}>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="kpi">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Due now</p>
          <p className="mt-1 font-display text-2xl text-ink">{inr(due)}</p>
          <p className="text-[11px] text-slate-500">examination fee</p>
        </div>
        <div className="kpi">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Paid this session</p>
          <p className="mt-1 font-display text-2xl text-ink">{inr(111000 + paidExtra)}</p>
          <p className="text-[11px] text-slate-500">tuition + hostel + lab</p>
        </div>
        <div className="kpi">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Scholarships</p>
          <p className="mt-1 font-display text-2xl text-ink">{inr(30000)}</p>
          <p className="text-[11px] text-slate-500">1 disbursed · 1 applied</p>
        </div>
      </div>

      {due > 0 ? (
        <div className="card mt-5 flex flex-wrap items-center justify-between gap-3 border-brand-300/60 p-5">
          <div>
            <p className="font-display text-lg">Examination fee due</p>
            <p className="text-[11.5px] text-slate-600">{inr(due)} · pay before 25/11/2026 to keep your hall ticket</p>
          </div>
          <button onClick={() => pay("Examination fee — Semester 5", due)} className="btn-primary btn-sm">Pay now</button>
        </div>
      ) : null}

      {paid ? (
        <div className="card mt-3 border-brand-300 bg-brand-50/50 p-4">
          <p className="text-[12.5px] font-semibold text-ink">Payment successful · receipt {paid}</p>
          <p className="text-[11.5px] text-slate-600">A receipt PDF is available in the ledger below.</p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-beige px-5 py-3">
            <p className="font-display text-lg">Fee ledger</p>
          </div>
          <table className="w-full text-left text-[12.5px]">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Head</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-4 py-2 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {[...store.payments.map((p) => ({ date: p.at.slice(0, 10), head: p.head, amount: p.amount, status: "Paid", mode: p.mode, receipt: p.receipt })), ...fees.ledger].map((l, i) => (
                <tr key={`${l.head}-${i}`}>
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-ink">{l.head}</p>
                    <p className="text-[10px] text-slate-500">{l.mode}</p>
                  </td>
                  <td className="px-2 py-2.5 text-slate-600">{fmtDate(l.date)}</td>
                  <td className="px-2 py-2.5 font-semibold">{inr(l.amount)}</td>
                  <td className="px-2 py-2.5">
                    <span className={l.status === "Paid" ? "badge-green" : l.status === "Due" ? "badge-red" : "badge-slate"}>{l.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {l.status === "Paid" ? (
                      <span className="font-mono text-[10.5px] text-slate-500">{l.receipt}</span>
                    ) : l.status === "Due" ? (
                      <button onClick={() => pay(l.head, l.amount)} className="text-[11px] font-semibold text-brand-700 hover:underline">Pay</button>
                    ) : (
                      <span className="text-[10.5px] text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Installments</p>
            <ul className="mt-3 space-y-2">
              {fees.installments.map((i) => (
                <li key={i.name} className="flex items-center justify-between gap-2 rounded-xl border border-beige/70 bg-ivory/50 px-3 py-2">
                  <div>
                    <p className="text-[11.5px] font-medium text-ink">{i.name}</p>
                    <p className="text-[10px] text-slate-500">due {fmtDate(i.due)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11.5px] font-semibold text-ink">{inr(i.amount)}</p>
                    <span className={i.status === "Paid" ? "badge-green" : "badge-slate"}>{i.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Scholarships</p>
            <ul className="mt-3 space-y-2">
              {fees.scholarships.map((s) => (
                <li key={s.name} className="rounded-xl bg-ivory/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11.5px] font-semibold text-ink">{s.name}</p>
                    <span className={s.status === "Disbursed" ? "badge-green" : "badge-amber"}>{s.status}</span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-slate-500">{inr(s.amount)} · {s.session}</p>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10.5px] text-slate-500">Merit and need-based awards are auto-evaluated from your application.</p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
