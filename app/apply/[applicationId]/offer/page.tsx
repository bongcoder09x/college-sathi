import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import StatusActions from "@/components/StatusActions";
import { BRAND, campuses, getProgram } from "@/lib/data";
import { getApplication } from "@/lib/store";
import { fmtDate, inr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function OfferPage({ params }: { params: { applicationId: string } }) {
  const app = getApplication(params.applicationId);
  if (!app || app.offer.status === "none") notFound();
  const program = getProgram(app.offer.programSlug || app.preferences[0]?.programSlug || "");
  const campus = campuses.find((c) => c.slug === (app.offer.campusSlug || app.preferences[0]?.campusSlug));
  const admissionAmount = (program?.feesPerYear || 100000) + 12500;

  return (
    <div className="shell py-10">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Offer of admission</p>
          <h1 className="h2 mt-1">{app.personal.fullName}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/apply/${app.id}/status`} className="btn-outline btn-sm">Back to tracker</Link>
          <PrintButton label="Print offer letter" />
          <StatusActions
            id={app.id}
            offerIssued={app.offer.status === "issued"}
            offerAccepted={app.offer.status === "accepted"}
            admissionPaid={Boolean(app.admissionFee?.paid)}
            admissionAmount={admissionAmount}
          />
        </div>
      </div>

      <div className="print-sheet mx-auto max-w-2xl rounded-xl2 border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="font-display text-xl text-ink">{BRAND.name}</p>
            <p className="text-[11.5px] text-slate-500">{campus?.address || BRAND.address}</p>
          </div>
          <div className="text-right text-[11.5px] text-slate-500">
            <p>Ref: {app.id}/OFFER</p>
            <p>{fmtDate(app.offer.issuedAt || "")}</p>
          </div>
        </div>

        <p className="mt-6 text-[13px] leading-relaxed text-slate-700">
          Dear <strong className="text-ink">{app.personal.fullName || "Candidate"}</strong>,
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-700">
          Congratulations. Based on your application, documents and performance in the Common Sathi Admission Test
          2026, we are pleased to offer you a provisional seat in the <strong>{program?.name}</strong> at{" "}
          <strong>{campus?.name}</strong> for the Autumn 2026 session.
        </p>

        <dl className="mt-5 grid gap-x-8 gap-y-2 rounded-xl bg-sand p-4 text-[12.5px] sm:grid-cols-2">
          <div><dt className="text-slate-500">Programme</dt><dd className="font-semibold text-ink">{program?.name}</dd></div>
          <div><dt className="text-slate-500">Campus</dt><dd className="font-semibold text-ink">{campus?.shortName}</dd></div>
          <div><dt className="text-slate-500">Duration</dt><dd className="font-semibold text-ink">{program?.duration}</dd></div>
          <div><dt className="text-slate-500">Roll number</dt><dd className="font-semibold text-ink">{app.rollNo || "Allotted at enrolment"}</dd></div>
          <div><dt className="text-slate-500">Admission fee</dt><dd className="font-semibold text-ink">{inr(admissionAmount)}</dd></div>
          <div><dt className="text-slate-500">Accept by</dt><dd className="font-semibold text-ink">{fmtDate(app.offer.deadline || "")}</dd></div>
        </dl>

        <p className="mt-5 text-[12.5px] leading-relaxed text-slate-700">
          To confirm your seat, accept this offer and pay the admission fee before the date above. If the fee is not
          received in time, the seat will be released to the waiting list. Fees once paid are refundable only as per
          the college refund policy.
        </p>

        <div className="mt-8 flex items-end justify-between">
          <div>
            <p className="text-[10.5px] uppercase tracking-wide text-slate-400">Status</p>
            <p className="mt-1 text-[12px] font-semibold text-brand-700">
              {app.admissionFee?.paid
                ? "Enrolled"
                : app.offer.status === "accepted"
                ? "Offer accepted · fee pending"
                : "Offer issued · awaiting acceptance"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display italic text-brand-800">S. Bhattacharya</p>
            <p className="text-[11px] text-slate-500">Registrar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
