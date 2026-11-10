import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import { BRAND, getProgram } from "@/lib/data";
import { getApplication } from "@/lib/store";
import { fmtDateTime, inr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ReceiptPage({ params }: { params: { applicationId: string } }) {
  const app = getApplication(params.applicationId);
  if (!app || !app.applicationFee) notFound();
  const fee = app.applicationFee;
  const program = getProgram(app.preferences[0]?.programSlug);

  return (
    <div className="shell py-10">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Fee receipt</p>
          <h1 className="h2 mt-1">{fee.receiptNo}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/apply/${app.id}/status`} className="btn-outline btn-sm">Back to tracker</Link>
          <PrintButton label="Download / print receipt" />
        </div>
      </div>

      <div className="print-sheet mx-auto max-w-2xl rounded-xl2 border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="font-display text-xl text-ink">{BRAND.name}</p>
            <p className="text-[11.5px] text-slate-500">{BRAND.address}</p>
            <p className="text-[11.5px] text-slate-500">GSTIN 19AAKCC1234M1Z5 · PAN AAKCC1234M</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">Application fee receipt</p>
            <p className="mt-1 font-mono text-[12px] text-slate-600">{fee.receiptNo}</p>
          </div>
        </div>

        <dl className="mt-5 grid gap-x-8 gap-y-2 text-[12.5px] sm:grid-cols-2">
          <Row k="Applicant" v={app.personal.fullName || "—"} />
          <Row k="Application ID" v={app.id} />
          <Row k="Programme" v={program?.name || "—"} />
          <Row k="Category" v={app.personal.category || "—"} />
          <Row k="Contact" v={app.applicant.email || app.applicant.phone || "—"} />
          <Row k="Payment mode" v={fee.mode} />
          <Row k="Transaction ID" v={fee.txnId} />
          <Row k="Paid on" v={fmtDateTime(fee.paidAt)} />
        </dl>

        <table className="mt-6 w-full text-left text-[12.5px]">
          <thead className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Particulars</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-2.5">
                Application & entrance test fee — {program?.level || "UG"} programme
              </td>
              <td className="px-3 py-2.5 text-right">{inr(fee.amount)}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-2.5">Convenience fee</td>
              <td className="px-3 py-2.5 text-right">{inr(0)}</td>
            </tr>
            <tr>
              <td className="px-3 py-3 text-right font-semibold text-ink">Total paid</td>
              <td className="px-3 py-3 text-right font-display text-lg text-brand-700">{inr(fee.amount)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-5 rounded-lg bg-sand p-3 text-[11.5px] leading-relaxed text-slate-600">
          This is a computer-generated receipt for a demo transaction. The application fee is non-refundable and
          non-transferable. Retain this receipt until the admission process is complete.
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[10.5px] uppercase tracking-wide text-slate-400">Demo stamp</p>
            <p className="mt-1 rounded border border-dashed border-brand-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700">
              Paid · demo gateway
            </p>
          </div>
          <div className="text-right">
            <p className="font-display italic text-brand-800">S. Bhattacharya</p>
            <p className="text-[11px] text-slate-500">Accounts Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2 border-b border-dashed border-slate-100 py-1.5">
      <dt className="min-w-[110px] text-slate-500">{k}</dt>
      <dd className="font-medium text-ink">{v}</dd>
    </div>
  );
}
