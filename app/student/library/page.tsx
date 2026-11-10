"use client";

import { useMemo, useState } from "react";
import PortalShell, { studentNav } from "@/components/PortalShell";
import { library } from "@/lib/portal";
import { reserveBook, usePortalStore } from "@/lib/portalStore";
import { fmtDate, inr } from "@/lib/utils";

export default function LibraryPage() {
  const store = usePortalStore();
  const [q, setQ] = useState("");
  const results = useMemo(
    () => library.catalogue.filter((b) => (b.title + b.author).toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <PortalShell title="Library" subtitle="Catalogue, loans, reservations and fines" groups={studentNav}>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-lg">Search the catalogue</p>
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate-400">1.2 lakh volumes</span>
            </div>
            <input className="input mt-3" placeholder="Title, author or ISBN" value={q} onChange={(e) => setQ(e.target.value)} />
            <ul className="mt-3 divide-y divide-beige/60">
              {results.map((b) => {
                const reserved = store.reservations.find((r) => r.title === b.title);
                return (
                  <li key={b.isbn} className="flex flex-wrap items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium text-ink">{b.title}</p>
                      <p className="text-[10.5px] text-slate-500">{b.author} · shelf {b.shelf}</p>
                    </div>
                    <span className={b.available ? "badge-green" : "badge-red"}>
                      {b.available ? `${b.available} available` : "all issued"}
                    </span>
                    {reserved ? (
                      <span className="badge-amber">Reserved</span>
                    ) : (
                      <button onClick={() => reserveBook(b.title)} className="text-[11px] font-semibold text-brand-700 hover:underline">
                        Reserve
                      </button>
                    )}
                  </li>
                );
              })}
              {results.length === 0 ? <li className="py-6 text-center text-[12px] text-slate-500">No title matches that search.</li> : null}
            </ul>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-beige px-5 py-3">
              <p className="font-display text-lg">My loans</p>
              <span className={library.fine ? "badge-red" : "badge-green"}>{library.fine ? `Fine ${inr(library.fine)}` : "No fines"}</span>
            </div>
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-2 py-2">Due</th>
                  <th className="px-4 py-2 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/60">
                {library.loans.map((l) => (
                  <tr key={l.title}>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-ink">{l.title}</p>
                      <p className="text-[10px] text-slate-500">{l.author}</p>
                    </td>
                    <td className="px-2 py-2.5 text-slate-600">{fmtDate(l.due)}</td>
                    <td className="px-4 py-2.5 text-right">
                      {l.fine ? <span className="font-semibold text-brand-700">{inr(l.fine)}</span> : <span className="text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-display text-lg">Fines</p>
            <p className="mt-1 text-[11.5px] text-slate-600">₹2 per day after the due date, capped at the book price.</p>
            <p className="mt-3 font-display text-2xl text-ink">{inr(library.fine)}</p>
            <button className="btn-primary btn-sm mt-2 w-full" disabled={!library.fine}>Pay fine</button>
          </div>
          <div className="card p-5">
            <p className="font-display text-lg">Reservations</p>
            <ul className="mt-2 space-y-1.5">
              {store.reservations.length === 0 ? <li className="text-[11.5px] text-slate-500">Nothing reserved yet.</li> : null}
              {store.reservations.map((r) => (
                <li key={r.title + r.at} className="flex items-center justify-between text-[11.5px]">
                  <span className="truncate text-slate-600">{r.title}</span>
                  <span className="badge-amber shrink-0">{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
