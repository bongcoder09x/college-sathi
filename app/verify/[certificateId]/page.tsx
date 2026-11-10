import type { Metadata } from "next";
import Link from "next/link";
import { certificates } from "@/lib/data";
import { fmtDate } from "@/lib/utils";

export function generateMetadata({ params }: { params: { certificateId: string } }): Metadata {
  return { title: `Verify ${params.certificateId}` };
}

export default function VerifyResultPage({ params }: { params: { certificateId: string } }) {
  const id = decodeURIComponent(params.certificateId).toUpperCase();
  const record = certificates[id];

  if (!record) {
    return (
      <div className="shell py-16">
        <div className="mx-auto max-w-xl card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-600">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </div>
          <p className="mt-4 font-display text-2xl">No record found</p>
          <p className="muted mt-2">
            The ID <strong className="font-mono text-ink">{id}</strong> does not match any certificate issued by
            College Sathi. Check for typos, or ask the holder to share the QR code printed on the certificate.
          </p>
          <Link href="/verify" className="btn-outline btn-sm mt-5">Try another ID</Link>
        </div>
      </div>
    );
  }

  const valid = record.status === "valid";

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-2xl">
        <div className={`overflow-hidden rounded-[26px] border ${valid ? "border-brand-300" : "border-rose-300"} bg-white shadow-lift`}>
          <div className={`flex items-center justify-between gap-4 px-7 py-6 text-white ${valid ? "bg-brand-700" : "bg-rose-700"}`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Certificate verification</p>
              <p className="mt-1 font-display text-2xl">{valid ? "Verified & valid" : "Revoked certificate"}</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {valid ? <path d="m4 12 5 5L20 6" /> : <path d="M6 6l12 12M18 6 6 18" />}
              </svg>
            </span>
          </div>
          <dl className="divide-y divide-slate-100">
            {[
              ["Verification ID", record.id],
              ["Certificate type", record.type],
              ["Holder", record.holder],
              ["Programme", record.program],
              ["Campus", record.campus],
              ["Issued on", fmtDate(record.issuedOn)],
              ["Signed by", record.registrar],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 px-7 py-3.5 sm:flex-row sm:items-baseline sm:justify-between">
                <dt className="text-[12px] uppercase tracking-wide text-slate-400">{k}</dt>
                <dd className="text-[14px] font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-slate-200 bg-slate-50 px-7 py-4 text-[12px] text-slate-500">
            {valid
              ? "This record is current as of today. For a signed copy, write to registrar@collegesathi.edu.in."
              : "This certificate was withdrawn by the examination board. It must not be accepted as proof of qualification."}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/verify" className="btn-outline btn-sm">Verify another</Link>
          <button className="btn-ghost btn-sm" disabled>Download verification slip</button>
        </div>
      </div>
    </div>
  );
}
