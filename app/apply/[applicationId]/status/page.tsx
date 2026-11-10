import Link from "next/link";
import { notFound } from "next/navigation";
import StatusActions from "@/components/StatusActions";
import { campuses, getProgram, programs } from "@/lib/data";
import { getApplication } from "@/lib/store";
import { fmtDate, fmtDateTime, inr } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STAGES = [
  { key: "submitted", label: "Application submitted", note: "Form and fee received" },
  { key: "verified", label: "Documents verified", note: "Checked by the admission cell" },
  { key: "merit", label: "Merit list published", note: "Rank against your preference" },
  { key: "offered", label: "Offer letter issued", note: "Accept and pay admission fee" },
  { key: "enrolled", label: "Enrolled", note: "Seat confirmed" },
];

export default function StatusPage({ params }: { params: { applicationId: string } }) {
  const app = getApplication(params.applicationId);
  if (!app) notFound();

  const order = ["draft", "submitted", "verified", "merit", "offered", "enrolled"];
  const currentIndex = order.indexOf(app.status);
  const firstProgram = getProgram(app.preferences[0]?.programSlug);
  const offeredProgram = getProgram(app.offer.programSlug || "");
  const offeredCampus = campuses.find((c) => c.slug === (app.offer.campusSlug || app.preferences[0]?.campusSlug));
  const admissionAmount = (offeredProgram?.feesPerYear || firstProgram?.feesPerYear || 100000) + 12500;
  const canHallTicket = currentIndex >= 2 && Boolean(app.applicationFee?.paid);

  return (
    <div className="shell py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Application tracker</p>
          <h1 className="h2 mt-1">{app.personal.fullName || "Your application"}</h1>
          <p className="muted mt-1 text-[13px]">
            {app.id} · {app.applicant.email || app.applicant.phone} · last updated {fmtDateTime(app.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/apply/${app.id}`} className="btn-outline btn-sm">Continue form</Link>
          {app.applicationFee ? (
            <Link href={`/apply/${app.id}/receipt`} className="btn-ghost btn-sm">Receipt</Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* status summary */}
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-900 px-6 py-5 text-white">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-400">Current status</p>
                <p className="mt-1 font-display text-2xl capitalize">{app.status}</p>
              </div>
              <div className="text-right text-[12.5px] text-brand-100">
                <p>Preference 1</p>
                <p className="font-semibold text-white">{firstProgram?.shortName || "—"}</p>
                <p>{campuses.find((c) => c.slug === app.preferences[0]?.campusSlug)?.shortName || ""}</p>
              </div>
            </div>

            <ol className="relative space-y-1 px-6 py-5">
              {STAGES.map((s, i) => {
                const stageIndex = order.indexOf(s.key);
                const done = currentIndex >= stageIndex && currentIndex !== -1;
                const at = app.timeline.find((t) => t.stage === s.key);
                return (
                  <li key={s.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${
                          done ? "bg-brand-600 text-white" : "border border-dashed border-slate-300 text-slate-400"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      {i < STAGES.length - 1 ? (
                        <span className={`my-1 w-px flex-1 ${done ? "bg-brand-300" : "bg-slate-200"}`} />
                      ) : null}
                    </div>
                    <div className={`pb-4 ${done ? "" : "opacity-60"}`}>
                      <p className="text-[13.5px] font-semibold text-ink">{s.label}</p>
                      <p className="text-[12px] text-slate-500">
                        {at ? `${fmtDate(at.at)} · ${at.note || ""}` : s.note}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* offer */}
          {app.offer.status !== "none" ? (
            <div className="card border-brand-300 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="badge-green">Offer issued</span>
                  <p className="mt-2 font-display text-xl">
                    {offeredProgram?.name} · {offeredCampus?.shortName}
                  </p>
                  <p className="mt-1 text-[13px] text-slate-600">
                    Issued {fmtDate(app.offer.issuedAt || "")} · accept by {fmtDate(app.offer.deadline || "")}
                  </p>
                </div>
                <Link href={`/apply/${app.id}/offer`} className="btn-outline btn-sm">View offer letter</Link>
              </div>
              <div className="mt-4 rounded-xl bg-sand p-4 text-[12.5px] text-slate-700">
                Admission fee payable: <strong className="text-ink">{inr(admissionAmount)}</strong> (first-year tuition
                plus one-time charges). Paying confirms your seat and generates the enrolment number.
              </div>
              <div className="mt-4">
                <StatusActions
                  id={app.id}
                  offerIssued={app.offer.status === "issued"}
                  offerAccepted={app.offer.status === "accepted"}
                  admissionPaid={Boolean(app.admissionFee?.paid)}
                  admissionAmount={admissionAmount}
                />
                {app.offer.status === "accepted" && !app.admissionFee?.paid ? (
                  <p className="mt-2 text-[12px] text-slate-500">Offer accepted — admission fee pending.</p>
                ) : null}
                {app.admissionFee?.paid ? (
                  <p className="mt-2 text-[12px] font-semibold text-brand-700">
                    Admission fee paid · receipt {app.admissionFee.receiptNo}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* downloads */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="font-display text-lg">Entrance test hall ticket</p>
              <p className="mt-1 text-[12.5px] text-slate-600">
                {canHallTicket
                  ? `Roll number ${app.rollNo || "—"} · test on 24 November 2026, 10:00 AM.`
                  : "Available after your documents are verified and the fee is paid."}
              </p>
              {canHallTicket ? (
                <Link href={`/apply/${app.id}/hall-ticket`} className="btn-primary btn-sm mt-3">Download hall ticket</Link>
              ) : (
                <button className="btn-outline btn-sm mt-3" disabled>Not available yet</button>
              )}
            </div>
            <div className="card p-5">
              <p className="font-display text-lg">Application receipt</p>
              <p className="mt-1 text-[12.5px] text-slate-600">
                {app.applicationFee
                  ? `${inr(app.applicationFee.amount)} paid on ${fmtDate(app.applicationFee.paidAt)} · ${app.applicationFee.receiptNo}`
                  : "Pay the application fee to generate a receipt."}
              </p>
              {app.applicationFee ? (
                <Link href={`/apply/${app.id}/receipt`} className="btn-outline btn-sm mt-3">Open receipt</Link>
              ) : (
                <Link href={`/apply/${app.id}`} className="btn-primary btn-sm mt-3">Pay ₹750</Link>
              )}
            </div>
          </div>

          {/* activity log */}
          <div className="card p-6">
            <p className="font-display text-lg">Activity log</p>
            <ul className="mt-3 divide-y divide-slate-100">
              {app.timeline
                .slice()
                .reverse()
                .map((t, i) => (
                  <li key={i} className="flex items-start justify-between gap-4 py-2.5">
                    <div>
                      <p className="text-[13px] font-medium text-ink">{t.label}</p>
                      {t.note ? <p className="text-[11.5px] text-slate-500">{t.note}</p> : null}
                    </div>
                    <span className="shrink-0 text-[11.5px] text-slate-400">{fmtDateTime(t.at)}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* side */}
        <aside className="space-y-4">
          <div className="card p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Your preferences</p>
            <ol className="mt-3 space-y-2">
              {app.preferences.filter((p) => p.programSlug).map((p, i) => (
                <li key={i} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[12.5px] font-semibold text-ink">
                    {i + 1}. {programs.find((x) => x.slug === p.programSlug)?.shortName}
                  </p>
                  <p className="text-[11.5px] text-slate-500">
                    {campuses.find((c) => c.slug === p.campusSlug)?.shortName} ·{" "}
                    {inr(programs.find((x) => x.slug === p.programSlug)?.feesPerYear || 0)} / yr
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5">
            <p className="font-display text-lg">Documents</p>
            <ul className="mt-3 space-y-2">
              {app.documents.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-2 text-[12.5px]">
                  <span className="truncate text-slate-700">{d.kind}</span>
                  <span className="badge-green shrink-0">{d.status}</span>
                </li>
              ))}
              {app.documents.length === 0 ? <li className="text-[12.5px] text-slate-500">No documents yet.</li> : null}
            </ul>
          </div>

          <div className="card bg-sand p-5">
            <p className="text-[12.5px] font-semibold text-ink">Need a correction?</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-600">
              Fields stay editable until the documents are verified. After that, write to admission@collegesathi.edu.in
              with your application ID.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
