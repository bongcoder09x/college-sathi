import type { Metadata } from "next";
import Link from "next/link";
import ApplyRegister from "@/components/ApplyRegister";
import { programs } from "@/lib/data";
import { listApplications } from "@/lib/store";
import { fmtDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admission portal",
  description:
    "Apply to College Sathi in seven guided steps. Verify your mobile with an OTP, save progress at every step and pay the application fee online.",
};

const steps = [
  "Programme & campus preferences (up to 3)",
  "Personal details — name, DOB, category, ID",
  "Guardian details",
  "Academic history with marksheets",
  "Documents checklist with upload validation",
  "Review & declaration",
  "Application fee payment → receipt",
];

export default function ApplyPage() {
  const demo = listApplications().slice(0, 4);

  return (
    <div className="shell py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
        <div>
          <p className="eyebrow">Admission portal · Autumn 2026</p>
          <h1 className="h1 mt-2 max-w-2xl text-ink">
            Seven steps. One afternoon. <span className="italic text-brand-700">Zero queue.</span>
          </h1>
          <p className="muted mt-4 max-w-xl">
            The wizard saves every field as you type, so you can stop halfway and come back on any device. Uploads are
            validated for type and size before they are accepted.
          </p>

          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-[10.5px] font-bold text-brand-700">
                  {i + 1}
                </span>
                <p className="text-[12.5px] leading-relaxed text-slate-700">{s}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Demo applications you can open right away
            </p>
            <div className="mt-3 space-y-2">
              {demo.map((a) => (
                <Link
                  key={a.id}
                  href={`/apply/${a.id}/status`}
                  className="card card-hover flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="text-[13.5px] font-semibold text-ink">
                      {a.id} · {a.personal.fullName || a.applicant.email || a.applicant.phone || "Unnamed draft"}
                    </p>
                    <p className="text-[11.5px] text-slate-500">
                      {programs.find((p) => p.slug === a.preferences[0]?.programSlug)?.shortName || "No preference yet"} ·
                      updated {fmtDate(a.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-slate">{a.status}</span>
                    <span className="text-[11.5px] font-semibold text-brand-700">Open →</span>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] text-slate-500">
              You can also continue filling any of these — autosave writes back to the demo store.
            </p>
          </div>

          <div className="mt-8 rounded-xl2 border border-dashed border-slate-300 bg-white/70 p-5">
            <p className="text-[12.5px] font-semibold text-ink">What you will need</p>
            <ul className="mt-2 grid gap-1.5 text-[12.5px] text-slate-600 sm:grid-cols-2">
              <li>• Class 10 and 12 mark sheets (PDF)</li>
              <li>• Aadhaar / passport (masked is fine)</li>
              <li>• A recent passport photograph</li>
              <li>• Guardian's mobile number</li>
              <li>• Caste / income certificate, if applicable</li>
              <li>• ₹750 application fee (₹1,200 for PG)</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <ApplyRegister />
          <div className="card p-5">
            <p className="font-display text-lg">Already applied?</p>
            <p className="muted mt-1 text-[13px]">
              Sign in with the same mobile number to resume your draft, download the hall ticket or check your status.
            </p>
            <Link href="/apply/CS-APP-1042/status" className="btn-outline btn-sm mt-3 w-full">
              Open the status tracker
            </Link>
          </div>
          <div className="card bg-brand-900 p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-400">Helpline</p>
            <p className="mt-1 font-display text-2xl">1800 120 4455</p>
            <p className="mt-1 text-[12.5px] text-brand-100">9 AM – 7 PM, Monday to Saturday</p>
          </div>
        </div>
      </div>
    </div>
  );
}
