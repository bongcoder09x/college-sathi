import type { Metadata } from "next";
import Link from "next/link";
import AdminApplications from "@/components/AdminApplications";
import { programs } from "@/lib/data";
import { listApplications, store } from "@/lib/store";
import { fmtDate, inr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Staff console" };

export default function AdminPage() {
  const applications = listApplications();
  const enquiries = store().enquiries;
  const count = (s: string) => applications.filter((a) => a.status === s).length;
  const feeCollected = applications.reduce(
    (sum, a) => sum + (a.applicationFee?.amount || 0) + (a.admissionFee?.amount || 0),
    0
  );
  const seatRows = programs.slice(0, 6).map((p) => ({
    program: p.shortName,
    seats: p.seats,
    applied: applications.filter((a) => a.preferences.some((x) => x.programSlug === p.slug)).length,
  }));

  return (
    <div className="shell py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Staff console · demo</p>
          <h1 className="h2 mt-1">Admission control room</h1>
          <p className="muted mt-1 text-[13px]">
            Verification queue, merit movement and CRM leads — all reading the in-memory demo store.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/apply" className="btn-outline btn-sm">Public portal</Link>
          <Link href="/student" className="btn-ghost btn-sm">Student view</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Applications", value: String(applications.length), note: `${count("draft")} drafts in progress` },
          { label: "Awaiting verification", value: String(count("submitted")), note: "Documents to check" },
          { label: "Offers out", value: String(count("offered")), note: `${count("enrolled")} enrolled` },
          { label: "Fees collected", value: inr(feeCollected), note: "Application + admission (demo)" },
        ].map((k) => (
          <div key={k.label} className="kpi">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">{k.label}</p>
            <p className="mt-1 font-display text-2xl text-ink">{k.value}</p>
            <p className="mt-0.5 text-[11.5px] text-slate-500">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg">Applications</p>
              <p className="text-[11.5px] text-slate-500">Advance moves one stage forward; every action is logged</p>
            </div>
            <AdminApplications applications={applications} />
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Seat position</p>
            <div className="mt-4 space-y-3">
              {seatRows.map((r) => {
                const pctFull = Math.min(100, Math.round((r.applied / r.seats) * 100));
                return (
                  <div key={r.program}>
                    <div className="flex items-baseline justify-between text-[12.5px]">
                      <span className="font-medium text-ink">{r.program}</span>
                      <span className="text-slate-500">{r.applied} / {r.seats} seats</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${pctFull > 80 ? "bg-accent-500" : "bg-brand-600"}`} style={{ width: `${pctFull}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">CRM enquiries</p>
              <span className="badge-amber">{enquiries.filter((e) => e.stage === "New").length} new</span>
            </div>
            <ul className="mt-3 space-y-3">
              {enquiries.slice(0, 5).map((e) => (
                <li key={e.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12.5px] font-semibold text-ink">{e.name}</p>
                    <span className={e.stage === "New" ? "badge-amber" : e.stage === "Converted" ? "badge-green" : "badge-slate"}>
                      {e.stage}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600">{e.message}</p>
                  <p className="mt-1.5 text-[10.5px] text-slate-400">
                    {e.phone} · {e.program} · {fmtDate(e.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-slate-500">
              New enquiries from the contact form appear here immediately.
            </p>
          </div>

          <div className="card bg-brand-900 p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-400">Demo notes</p>
            <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-brand-100">
              <li>• Data lives in server memory; restarting resets it.</li>
              <li>• No auth on this console — add SSO before production.</li>
              <li>• Payments are simulated, receipts are generated locally.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
