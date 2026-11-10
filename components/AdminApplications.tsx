"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getProgram, campuses } from "@/lib/data";
import type { Application } from "@/lib/types";
import { fmtDate, inr } from "@/lib/utils";

const STATUSES = ["all", "draft", "submitted", "verified", "merit", "offered", "enrolled", "rejected"];

export default function AdminApplications({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      applications
        .filter((a) => (status === "all" ? true : a.status === status))
        .filter((a) =>
          !query.trim()
            ? true
            : (a.id + a.personal.fullName + a.applicant.email + a.applicant.phone)
                .toLowerCase()
                .includes(query.trim().toLowerCase())
        ),
    [applications, status, query]
  );

  const advance = async (id: string) => {
    setBusy(id);
    await fetch(`/api/applications/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "advance" }),
    });
    setBusy(null);
    router.refresh();
  };

  const reject = async (id: string) => {
    setBusy(id);
    await fetch(`/api/applications/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    });
    setBusy(null);
    router.refresh();
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`chip !px-3 !py-1 !text-[12px] capitalize ${status === s ? "chip-active" : ""}`}>
              {s}
            </button>
          ))}
        </div>
        <input
          className="input sm:max-w-[240px]"
          placeholder="Search id, name, contact"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[12.5px]">
          <thead className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Application</th>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Preference 1</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((a) => {
              const program = getProgram(a.preferences[0]?.programSlug || "");
              const campus = campuses.find((c) => c.slug === a.preferences[0]?.campusSlug);
              return (
                <tr key={a.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <Link href={`/apply/${a.id}/status`} className="font-mono text-[11.5px] font-semibold text-brand-700 hover:underline">
                      {a.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{a.personal.fullName || "—"}</p>
                    <p className="text-[11px] text-slate-500">{a.applicant.email || a.applicant.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{program?.shortName || "—"}</p>
                    <p className="text-[11px] text-slate-500">{campus?.shortName || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    {a.applicationFee ? (
                      <span className="text-brand-700">{inr(a.applicationFee.amount)} paid</span>
                    ) : (
                      <span className="text-rose-600">Unpaid</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={a.status === "rejected" ? "badge-red" : a.status === "enrolled" ? "badge-green" : "badge-slate"}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{fmtDate(a.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => advance(a.id)}
                        disabled={busy === a.id || a.status === "enrolled" || a.status === "rejected"}
                        className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
                      >
                        {busy === a.id ? "…" : "Advance"}
                      </button>
                      <button
                        onClick={() => reject(a.id)}
                        disabled={busy === a.id || a.status === "rejected"}
                        className="rounded-full border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">No applications match that filter.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
