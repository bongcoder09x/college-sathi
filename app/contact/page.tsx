import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { BRAND, campuses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact & enquiries",
  description: "Ask the admission desk about fees, hostel, eligibility or scholarships. Enquiries reach the CRM queue.",
};

export default function ContactPage() {
  return (
    <div className="shell py-12">
      <p className="eyebrow">Talk to us</p>
      <h1 className="h1 mt-2 text-ink">Ask anything about admissions</h1>
      <p className="muted mt-3 max-w-2xl">
        Fill this form and a campus counsellor calls you back within one working day. In this demo the enquiry is
        written to the in-memory CRM and appears in the admin panel.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ContactForm />
        <aside className="space-y-4">
          <div className="card p-5">
            <p className="font-display text-lg">Admission helpline</p>
            <p className="mt-2 text-sm font-semibold text-ink">{BRAND.phone}</p>
            <p className="text-[13px] text-slate-600">{BRAND.email}</p>
            <p className="mt-2 text-[12px] text-slate-500">Monday to Saturday, 9 AM – 7 PM IST</p>
          </div>
          {campuses.map((c) => (
            <div key={c.slug} className="card p-5">
              <p className="text-[13px] font-semibold text-ink">{c.shortName}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{c.address}</p>
              <p className="mt-1.5 text-[12.5px] text-slate-600">{c.phone} · {c.email}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
