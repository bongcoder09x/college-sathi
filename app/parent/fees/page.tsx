"use client";

import { useState } from "react";
import PortalShell, { parentNav } from "@/components/PortalShell";
import { children, parent } from "@/lib/portals";
import { fees } from "@/lib/portal";
import { payFee, usePortalStore } from "@/lib/portalStore";
import { useStaffStore } from "@/lib/staffStore";
import { fmtDate, inr } from "@/lib/utils";

export default function ParentFeesPage() {
  const store = useStaffStore();
  const portal = usePortalStore();
  const child = children.find((c) => c.id === store.child) || children[0];
  const [receipt, setReceipt] = useState<string | null>(null);
  const paid = portal.payments.reduce((s, p) => s + p.amount, 0);
  const due = Math.max(0, child.feeDue - (store.child === "ananya" ? paid : 0));

  return (
    <PortalShell
      title="Fees"
      subtitle={`${child.name} · pay, receipts and history`}
      groups={parentNav}
      person={{ name: parent.name, sub: "Parent · 2 wards" }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="kpi">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Due now</p>
          <p className="mt-1 font-display text-2xl text-ink">{inr(due)}</p>
          <p className="text-[11px] text-slate-500">{due ? "examination fee" : "all clear"}</p>
        </div>
        <div className="kpi">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Paid this session</p>
          <p className="mt-1 font-display text-2xl text-ink">{inr(111000 + paid)}</p>
          <p className="text-[11px] text-slate-500">tuition, hostel and lab</p>
        </div>
        <div className="kpi">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Receipts</p>
          <p className="mt-1 font-display text-2xl text-ink">{fees.ledger.filter((l) => l.status === "Paid").length + portal.payments.length}</p>
          <p className="text-[11px] text-slate-500">downloadable</p>
        </div>
      </div>

      {due > 0 ? (
        <div className="card mt-4 flex flex-wrap items-center justify-between gap-3 border-brand-300/60 p-5">
          <div>
            <p className="font-display text-lg">Pay {inr(due)}</p>
            <p className="text-[11.5px] text-slate-600">Examination fee · closes 25/11/2026</p>
          </div>
          <button
            onClick={() => {
              const entry = payFee(`Examination fee — ${child.name.split(" ")[0]}`, due, "UPI (demo)");
              setReceipt(entry.receipt);
            }}
            className="btn-primary btn-sm"
          >
            Pay now
          </button>
        </div>
      ) : null}

      {receipt ? (
        <div className="card mt-3 border-brand-300 bg-brand-50/50 p-4">
          <p className="text-[12.5px] font-semibold text-ink">Payment successful · {receipt}</p>
        </div>
      ) : null}

      <div className="card mt-5 overflow-hidden">
        <div className="border-b border-beige px-5 py-3">
          <p className="font-display text-lg">Payment history</p>
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
            {[...portal.payments.map((p) => ({ head: p.head, date: p.at.slice(0, 10), amount: p.amount, status: "Paid", receipt: p.receipt })), ...fees.ledger].map((l, i) => (
              <tr key={`${l.head}-${i}`}>
                <td className="px-4 py-2.5 font-medium text-ink">{l.head}</td>
                <td className="px-2 py-2.5 text-slate-600">{fmtDate(l.date)}</td>
                <td className="px-2 py-2.5 font-semibold">{inr(l.amount)}</td>
                <td className="px-2 py-2.5">
                  <span className={l.status === "Paid" ? "badge-green" : l.status === "Due" ? "badge-red" : "badge-slate"}>{l.status}</span>
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[10.5px] text-slate-500">{l.receipt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}
