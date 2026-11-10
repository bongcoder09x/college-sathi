import Link from "next/link";
import { BRAND } from "@/lib/data";
import type { Tenant } from "@/lib/tenant";
import CampusSwitcher from "./CampusSwitcher";

const nav = [
  { href: "/programs", label: "Programs" },
  { href: "/campuses/main", label: "Campuses" },
  { href: "/notices", label: "Notices" },
  { href: "/events", label: "Events" },
  { href: "/results/lookup", label: "Results" },
  { href: "/verify", label: "Verify" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ tenant }: { tenant: Tenant }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-cream/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9.5 12 4l9 5.5" />
              <path d="M5 11v8h14v-8" />
              <path d="M9.5 19v-5h5v5" />
            </svg>
          </span>
          <span className="leading-none">
            <span className="block font-display text-[17px] font-semibold tracking-tight text-ink">{BRAND.name}</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {BRAND.latin}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-[13.5px] font-medium text-slate-600 transition hover:bg-white hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CampusSwitcher current={tenant.slug} />
          </div>
          <Link href="/student" className="hidden rounded-full px-3 py-2 text-[13.5px] font-semibold text-slate-600 hover:text-brand-700 md:block">
            Student
          </Link>
          <Link href="/apply" className="btn-primary btn-sm">
            Apply now
          </Link>
          <details className="relative lg:hidden">
            <summary className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-slate-300 bg-white text-ink marker:content-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50">
                  {item.label}
                </Link>
              ))}
              <Link href="/student" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50">
                Student dashboard
              </Link>
              <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50">
                Admin panel
              </Link>
            </div>
          </details>
        </div>
      </div>
      <div className="border-t border-slate-200/70 bg-white/60">
        <div className="shell flex items-center justify-between gap-3 py-1.5 text-[11.5px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
            Viewing <strong className="font-semibold text-ink">{tenant.shortName}</strong>
            <span className="hidden sm:inline text-slate-400">
              · resolved from {tenant.resolvedFrom} ({tenant.host})
            </span>
          </span>
          <span className="hidden sm:inline">Session {BRAND.session} · Helpline {BRAND.phone}</span>
        </div>
      </div>
    </header>
  );
}
