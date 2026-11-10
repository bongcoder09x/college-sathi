import Link from "next/link";
import { BRAND, campuses } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="mt-20 px-3 pb-6 sm:px-5">
      <div className="mx-auto w-full max-w-shell">
        <div className="glass rounded-[26px] px-6 py-12 shadow-soft sm:px-10">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <p className="font-display text-[2rem] leading-none text-ink">{BRAND.name}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-accent-600">{BRAND.latin}</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">{BRAND.promise}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                {BRAND.address}
                <br />
                {BRAND.phone} · {BRAND.email}
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-700">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                Demo build · mock data · no live payments
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Campus</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                {campuses.map((c) => (
                  <li key={c.slug}>
                    <Link className="transition hover:text-brand-700" href={`/campuses/${c.slug}`}>
                      {c.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Quick links</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li><Link className="transition hover:text-brand-700" href="/programs">All programs</Link></li>
                <li><Link className="transition hover:text-brand-700" href="/apply">Admission portal</Link></li>
                <li><Link className="transition hover:text-brand-700" href="/results/lookup">Result lookup</Link></li>
                <li><Link className="transition hover:text-brand-700" href="/verify">Certificate verify</Link></li>
                <li><Link className="transition hover:text-brand-700" href="/student">Student dashboard</Link></li>
                <li><Link className="transition hover:text-brand-700" href="/admin">Admin panel</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-beige pt-5 text-[11.5px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 {BRAND.latin}. Built as a working demo.</span>
            <span className="flex gap-3">
              <span>Privacy</span>
              <span>Accessibility</span>
              <span>Grievance redressal</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
