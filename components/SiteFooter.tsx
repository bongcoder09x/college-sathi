import Link from "next/link";
import { BRAND, campuses } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="shell grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl text-ink">{BRAND.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">{BRAND.promise}</p>
          <p className="mt-4 text-sm text-slate-600">
            {BRAND.address}
            <br />
            {BRAND.phone} · {BRAND.email}
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-sand px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Demo build · mock data · no live payments
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Campus</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {campuses.map((c) => (
              <li key={c.slug}>
                <Link className="hover:text-brand-700" href={`/campuses/${c.slug}`}>
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link className="hover:text-brand-700" href="/programs">All programs</Link></li>
            <li><Link className="hover:text-brand-700" href="/apply">Admission portal</Link></li>
            <li><Link className="hover:text-brand-700" href="/results/lookup">Result lookup</Link></li>
            <li><Link className="hover:text-brand-700" href="/verify">Certificate verify</Link></li>
            <li><Link className="hover:text-brand-700" href="/student">Student dashboard</Link></li>
            <li><Link className="hover:text-brand-700" href="/admin">Admin panel</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5">
        <div className="shell flex flex-col gap-2 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {BRAND.latin}. Built as a working demo.</span>
          <span>Privacy · Accessibility · Grievance redressal</span>
        </div>
      </div>
    </footer>
  );
}
