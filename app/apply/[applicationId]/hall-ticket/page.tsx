import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import { BRAND, campuses, getProgram } from "@/lib/data";
import { getApplication } from "@/lib/store";
import { fmtDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function HallTicketPage({ params }: { params: { applicationId: string } }) {
  const app = getApplication(params.applicationId);
  if (!app) notFound();
  const program = getProgram(app.preferences[0]?.programSlug);
  const campus = campuses.find((c) => c.slug === app.preferences[0]?.campusSlug);

  return (
    <div className="shell py-10">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Entrance test · CSAT 2026</p>
          <h1 className="h2 mt-1">Hall ticket</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/apply/${app.id}/status`} className="btn-outline btn-sm">Back to tracker</Link>
          <PrintButton label="Download / print hall ticket" />
        </div>
      </div>

      <div className="print-sheet mx-auto max-w-2xl overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between gap-4 bg-brand-900 px-7 py-5 text-white">
          <div>
            <p className="font-display text-xl">{BRAND.name}</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-brand-200">Common Sathi Admission Test 2026</p>
          </div>
          <div className="text-right">
            <p className="text-[10.5px] uppercase tracking-wide text-brand-200">Hall ticket no</p>
            <p className="font-mono text-sm">{app.hallTicketNo || "—"}</p>
          </div>
        </div>

        <div className="grid gap-5 p-7 sm:grid-cols-[1fr_120px]">
          <dl className="grid gap-x-6 gap-y-2 text-[12.5px] sm:grid-cols-2">
            <Row k="Candidate" v={app.personal.fullName || "—"} />
            <Row k="Roll number" v={app.rollNo || "—"} />
            <Row k="Application ID" v={app.id} />
            <Row k="Category" v={app.personal.category || "—"} />
            <Row k="Programme" v={program?.shortName || "—"} />
            <Row k="Campus" v={campus?.shortName || "—"} />
            <Row k="Test date" v="24/11/2026" />
            <Row k="Reporting time" v="9:30 AM" />
            <Row k="Centre" v="Main Campus, Elgin Road, Kolkata" />
            <Row k="Duration" v="10:00 AM – 1:00 PM (180 min)" />
          </dl>
          <div className="flex flex-col items-center justify-start gap-2">
            <div className="grid h-28 w-28 place-items-center rounded-xl border border-slate-200 bg-slate-50">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span key={i} className={`h-2.5 w-2.5 ${[0,1,2,4,5,9,10,12,14,15,19,20,21,23,24].includes(i) ? "bg-ink" : "bg-transparent"}`} />
                ))}
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400">Scan at the gate</p>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-7 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Instructions</p>
          <ul className="mt-2 grid gap-1 text-[11.5px] leading-relaxed text-slate-600 sm:grid-cols-2">
            <li>• Carry this ticket and one photo ID (Aadhaar / passport).</li>
            <li>• Gates close at 10:15 AM. Late entry is not allowed.</li>
            <li>• No phones, smart watches or calculators inside the hall.</li>
            <li>• Use blue or black ballpoint pen only.</li>
            <li>• Report to the centre 30 minutes before the test.</li>
            <li>• This is a demo ticket generated for a demo application.</li>
          </ul>
        </div>
        <div className="flex items-end justify-between px-7 py-5">
          <p className="text-[11px] text-slate-500">Issued {fmtDate("2026-11-06")} · Controller of Examinations</p>
          <p className="font-display italic text-brand-800">S. Bhattacharya</p>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10.5px] uppercase tracking-wide text-slate-400">{k}</dt>
      <dd className="font-semibold text-ink">{v}</dd>
    </div>
  );
}
